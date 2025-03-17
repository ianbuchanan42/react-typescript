import { useState, useCallback } from 'react';
import './FormApp.css';

/*
 * TypeScript Interface for Form Data
 * - Defines the shape of our form data object
 * - Optional phone field (marked with ?)
 * - Strict typing ensures type safety throughout the component
 */
interface FormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/*
 * TypeScript Interface for Validation Errors
 * - Mirrors FormData structure but all fields are optional
 * - Allows for partial error objects
 * - Provides type safety for error messages
 */
interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

/*
 * Custom Hook: useFormValidation
 * Demonstrates:
 * - Custom hook pattern in TypeScript
 * - Pure validation logic separation
 * - Regular expressions for validation
 * Returns validation errors object
 */
const useFormValidation = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation: Required, min length 2
  if (!formData.name) {
    errors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  // Email validation: Required, regex pattern
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation: Optional, but must match pattern if provided
  if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Message validation: Required, min length 10
  if (!formData.message) {
    errors.message = 'Message is required';
  } else if (formData.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  return errors;
};

/*
 * FormFieldProps Interface
 * Defines the contract for props passed to the FormField component
 */
interface FormFieldProps {
  /** The label text displayed above the form field */
  label: string;

  /**
   * Type of the input field
   * Union type restricting to specific HTML input types and textarea
   * This ensures type safety and prevents invalid input types
   */
  type: 'text' | 'email' | 'tel' | 'textarea';

  /**
   * Name of the form field
   * Uses keyof to ensure name matches a key in FormData interface
   * This creates a type-safe connection between the field and form data
   */
  name: keyof FormData;

  /**
   * Current value of the input field
   * Controlled component pattern - React manages the input state
   */
  value: string;

  /**
   * Change handler function
   * Accepts change events from both input and textarea elements
   * Uses union type to handle both element types in one prop
   */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  /**
   * Optional error message
   * Undefined when no error exists
   * String containing error message when validation fails
   */
  error?: string;

  /**
   * Optional required field flag
   * Used for both HTML5 validation and UI indication
   * Defaults to false if not provided
   */
  required?: boolean;
}

const FormField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  required = true,
}: FormFieldProps) => (
  // Using fieldset and legend for each form field group
  <fieldset className='form-field'>
    <legend className='form-label' id={`${name}-label`}>
      {label}
      {required && <span className='required'>*</span>}
    </legend>
    <label htmlFor={name} className='visually-hidden'>
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`sf-input ${error ? 'error' : ''}`}
        rows={4}
        required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        placeholder={label}
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`sf-input ${error ? 'error' : ''}`}
        required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        placeholder={label}
      />
    )}
    {error && (
      <output
        className='error-message'
        id={`${name}-error`}
        role='alert'
        htmlFor={name}
      >
        {error}
      </output>
    )}
  </fieldset>
);

/*
 * FormApp Component
 * Demonstrates:
 * - Complex form handling
 * - Multiple hooks working together
 * - TypeScript type safety
 * - Error handling and validation
 * - Success feedback
 */
const FormApp = () => {
  /*
   * useState Hooks
   * - Typed state management for form data and UI state
   * - Generic types ensure type safety
   */
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  /*
   * Form Validation Strategy
   *
   * Derived State Pattern:
   * - validationErrors is computed directly from formData
   * - Not stored in state because it's completely determined by formData
   * - React will automatically recompute this when formData changes
   *
   * Benefits of this approach:
   * 1. Single Source of Truth
   *    - Validation state can't get out of sync with form data
   *    - No need to manage multiple related states
   *
   * 2. Automatic Updates
   *    - No need for useEffect to sync states
   *    - No risk of forgetting to update validation
   *    - No stale validation state possible
   *
   * 3. Simpler Mental Model
   *    - formData is the source of truth
   *    - validationErrors is always the current validation state
   *    - No need to track when/how validation state updates
   *
   * Note: We still use errors useState for UI purposes
   * - errors shows what we want to display to the user
   * - validationErrors is what's currently invalid
   */
  const validationErrors = useFormValidation(formData);

  /*
   * useCallback Hook for Form Updates
   * - Memoized change handler
   * - Type-safe event handling
   * - Immutable state updates
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Ensure value is always a string
      setFormData((prev) => ({
        ...prev,
        [name]: value || '',
      }));
      // Clear error when field is modified
      if (errors[name as keyof ValidationErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  /*
   * useCallback Hook for Form Submission
   * - Prevents default form behavior
   * - Validates form data
   * - Handles success/error states
   * - Resets form on success
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (Object.keys(validationErrors).length === 0) {
        // Form is valid, process submission
        console.log('Form submitted:', formData);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Form has errors
        setErrors(validationErrors);
      }
    },
    [formData, validationErrors]
  );

  return (
    /*
     * Using <main> as it represents the main content of the document
     * This helps screen readers identify the primary content area
     */
    <section className='form-app'>
      {/* <h1> is semantically correct for the main heading of the section */}
      <h1 className='sf-text-title'>Contact Form</h1>

      {/*
       * <form> with semantic attributes:
       * - noValidate: We handle validation in JavaScript
       * - aria-live: Announces validation errors to screen readers
       */}
      <form
        onSubmit={handleSubmit}
        className='contact-form'
        noValidate
        aria-live='polite'
      >
        {/*
         * <fieldset> groups related form fields
         * <legend> provides a caption for the fieldset
         */}
        <fieldset>
          <legend className='visually-hidden'>Contact Information</legend>
          <FormField
            label='Name'
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <FormField
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormField
            label='Phone'
            type='tel'
            name='phone'
            value={formData.phone || ''}
            onChange={handleChange}
            error={errors.phone}
            required={false}
          />
        </fieldset>

        {/*
         * Separate fieldset for message as it's a different group
         */}
        <fieldset>
          <legend className='visually-hidden'>Message</legend>
          <FormField
            label='Message'
            type='textarea'
            name='message'
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
          />
        </fieldset>

        <button
          type='submit'
          className='sf-button sf-button--primary submit-button'
        >
          Send Message
        </button>
      </form>

      {/*
       * Using <div role="alert"> for success message
       * role="alert" ensures screen readers announce the message immediately
       */}
      {showSuccess && (
        <div className='success-message' role='alert'>
          Message sent successfully!
        </div>
      )}
    </section>
  );
};

export default FormApp;
