import { test, expect } from '@playwright/test';
import { format } from 'date-fns';

test.describe('Complete Booking System Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.getByTestId('booking-system')).toBeVisible();
  });

  test('should complete the entire booking process successfully', async ({ page }) => {
    // Step 1: Date Selection
    // Select a date that's not Sunday and not in the past
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // Day after tomorrow
    if (futureDate.getDay() === 0) { // If it's Sunday
      futureDate.setDate(futureDate.getDate() + 1); // Move to Monday
    }
    
    // Click on the date button
    await page.locator(`button[name="day"]:has-text("${format(futureDate, 'd')}")`).click();
    
    // Verify the selected date is displayed correctly
    const expectedDateFormat = format(futureDate, 'EEEE, MMMM do, yyyy');
    await expect(page.getByTestId('selected-date')).toContainText(expectedDateFormat);
    
    // Navigate to time selection
    await page.getByTestId('next-to-time').click();
    await expect(page.getByTestId('time-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Step 2: Time Selection
    // Select a time slot
    await page.getByTestId('time-slot-10-00').click();
    await expect(page.getByTestId('selected-time')).toContainText('10:00');
    
    // Navigate to service selection
    await page.getByTestId('next-to-service').click();
    await expect(page.getByTestId('service-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Step 3: Service Selection
    // Select a service
    await page.getByTestId('service-haircut').click();
    await expect(page.getByTestId('selected-service')).toContainText('Haircut');
    
    // Navigate to customer details
    await page.getByTestId('next-to-details').click();
    await expect(page.getByTestId('details-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Step 4: Customer Details
    // Test form validation - try submitting with empty fields
    await page.getByTestId('submit-customer-info').click();
    await expect(page.getByTestId('name-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('phone-error')).toBeVisible();
    
    // Fill in invalid data to test validation
    await page.getByTestId('customer-name').fill('J'); // Too short
    await page.getByTestId('customer-email').fill('invalid-email'); // Invalid email
    await page.getByTestId('customer-phone').fill('123'); // Invalid phone
    
    // Check validation errors
    await page.getByTestId('submit-customer-info').click();
    await expect(page.getByTestId('name-error')).toContainText('at least 2 characters');
    await expect(page.getByTestId('email-error')).toContainText('valid email');
    await expect(page.getByTestId('phone-error')).toContainText('valid phone');
    
    // Fill in valid customer information
    await page.getByTestId('customer-name').fill('Jane Smith');
    await page.getByTestId('customer-email').fill('jane@example.com');
    await page.getByTestId('customer-phone').fill('(555) 123-4567');
    await page.getByTestId('customer-notes').fill('First time customer, prefer gentle styling');
    
    // Submit the form
    await page.getByTestId('submit-customer-info').click();
    
    // Step 5: Confirmation
    // Verify we're on the confirmation page
    await expect(page.getByTestId('confirmation-step')).toBeVisible();
    
    // Verify all booking details are displayed correctly
    await expect(page.getByTestId('confirm-date')).toContainText(expectedDateFormat);
    await expect(page.getByTestId('confirm-time')).toContainText('10:00');
    await expect(page.getByTestId('confirm-service')).toContainText('Haircut');
    await expect(page.getByTestId('confirm-price')).toContainText('$35');
    await expect(page.getByTestId('confirm-duration')).toContainText('30 minutes');
    
    // Verify customer information
    await expect(page.getByTestId('confirm-customer-name')).toContainText('Jane Smith');
    await expect(page.getByTestId('confirm-customer-email')).toContainText('jane@example.com');
    await expect(page.getByTestId('confirm-customer-phone')).toContainText('(555) 123-4567');
    await expect(page.getByTestId('confirm-customer-notes')).toContainText('First time customer');
    
    // Confirm the booking
    const dialogPromise = page.waitForEvent('dialog');
    await page.getByTestId('confirm-booking-button').click();
    
    // Handle the confirmation dialog
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Booking confirmed!');
    await dialog.accept();
    
    // Verify we're back at the date selection step (booking flow reset)
    await expect(page.getByTestId('date-tab')).toHaveAttribute('aria-selected', 'true');
  });

  test('should navigate back and forth between steps correctly', async ({ page }) => {
    // Select a date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    if (futureDate.getDay() === 0) {
      futureDate.setDate(futureDate.getDate() + 1);
    }
    
    await page.getByTestId('date-calendar').click();
    // Wait for the calendar to be fully visible
    await page.waitForSelector(`button[type="button"]:has-text("${format(futureDate, 'd')}")`);
    // Click on the date button using a more specific selector
    await page.locator(`button[type="button"]:has-text("${format(futureDate, 'd')}")`).click();
    
    // Store the expected date format for consistency
    const expectedDateFormat = format(futureDate, 'EEEE, MMMM do, yyyy');
    
    // Verify the selected date is displayed correctly
    await expect(page.getByTestId('selected-date')).toContainText(expectedDateFormat);
    
    await page.getByTestId('next-to-time').click();
    
    // Select a time
    await page.getByTestId('time-slot-14-00').click();
    await page.getByTestId('next-to-service').click();
    
    // Select a service
    await page.getByTestId('service-color').click();
    await page.getByTestId('next-to-details').click();
    
    // Fill customer details
    await page.getByTestId('customer-name').fill('Alex Johnson');
    await page.getByTestId('customer-email').fill('alex@example.com');
    await page.getByTestId('customer-phone').fill('(555) 987-6543');
    await page.getByTestId('submit-customer-info').click();
    
    // Now we're at confirmation, let's navigate back
    await page.getByTestId('back-button').click();
    await expect(page.getByTestId('details-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Verify form data is preserved
    await expect(page.getByTestId('customer-name')).toHaveValue('Alex Johnson');
    
    // Go back to service selection
    await page.getByTestId('back-to-service').click();
    await expect(page.getByTestId('service-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Verify service selection is preserved
    await expect(page.getByTestId('selected-service')).toContainText('Hair Coloring');
    
    // Go back to time selection
    await page.getByTestId('back-to-time').click();
    await expect(page.getByTestId('time-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Verify time selection is preserved
    await expect(page.getByTestId('selected-time')).toContainText('14:00');
    
    // Go back to date selection
    await page.getByTestId('back-to-date').click();
    await expect(page.getByTestId('date-tab')).toHaveAttribute('aria-selected', 'true');
  });

  test('should enforce validation rules and tab navigation restrictions', async ({ page }) => {
    // Initially, all tabs except date should be disabled
    await expect(page.getByTestId('time-tab')).toBeDisabled();
    await expect(page.getByTestId('service-tab')).toBeDisabled();
    await expect(page.getByTestId('details-tab')).toBeDisabled();
    
    // Select a date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 4);
    if (futureDate.getDay() === 0) {
      futureDate.setDate(futureDate.getDate() + 1);
    }
    
    await page.getByTestId('date-calendar').click();
    // Wait for the calendar to be fully visible
    await page.waitForSelector(`button[type="button"]:has-text("${format(futureDate, 'd')}")`);
    // Click on the date button using a more specific selector
    await page.locator(`button[type="button"]:has-text("${format(futureDate, 'd')}")`).click();
    
    // Now time tab should be enabled but others still disabled
    await expect(page.getByTestId('time-tab')).not.toBeDisabled();
    await expect(page.getByTestId('service-tab')).toBeDisabled();
    await expect(page.getByTestId('details-tab')).toBeDisabled();
    
    // Go to time selection
    await page.getByTestId('next-to-time').click();
    
    // Next button should be disabled until a time is selected
    await expect(page.getByTestId('next-to-service')).toBeDisabled();
    
    // Select a time
    await page.getByTestId('time-slot-15-30').click();
    
    // Now the next button should be enabled
    await expect(page.getByTestId('next-to-service')).not.toBeDisabled();
    await page.getByTestId('next-to-service').click();
    
    // Service tab should now be active
    await expect(page.getByTestId('service-tab')).toHaveAttribute('aria-selected', 'true');
    
    // Next button should be disabled until a service is selected
    await expect(page.getByTestId('next-to-details')).toBeDisabled();
    
    // Select a service
    await page.getByTestId('service-treatment').click();
    
    // Now the next button should be enabled
    await expect(page.getByTestId('next-to-details')).not.toBeDisabled();
  });
});