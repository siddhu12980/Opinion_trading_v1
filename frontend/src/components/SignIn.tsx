import React, { useState, FormEvent } from 'react';


interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
  submit?: string;
}

const SignIn = ({onSuccess}:any) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof FormData;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        // await signIn(formData);
        onSuccess()
        console.log('Form submitted:', formData);
        // Handle successful signin (e.g., redirect to dashboard)
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: 'Invalid email or password. Please try again.'
        }));
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="pb-4 px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">
            Sign in to your account
          </h2>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-lg shadow">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block mb-2 text-sm font-medium text-black text-left"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-black"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password" 
                  className="block mb-2 text-sm font-medium text-black"
                >
                  Password
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-black"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
              <label 
                htmlFor="rememberMe" 
                className="ml-2 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Sign Up Link
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <button onClick={setModes('signup')}  className="text-blue-600 hover:underline font-medium">
                Create account
              </button>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;