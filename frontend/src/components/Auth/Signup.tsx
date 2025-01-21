import axios from "axios";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { HTTP_SERVER_URL } from "../../constants/const";

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

async function HandleSignnup(formData: FormData) {
  const response = await axios.post(
    `${HTTP_SERVER_URL}/user/create/${formData.name}`,
    {
      email: formData.email,
      name: formData.name,
      password: formData.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 200) {
    console.log(response.data);

    if (response.data.data) {
      return formData.name;
    } else {
      if (response.data.message) {
        throw new Error(response.data.message);
      } else {
        throw new Error("Failed to create account. Please try again.");
      }
    }
  }
}

const Signup = ({ onSuccess }: { onSuccess: (userId: string) => void }) => {
  const predif = "test-user";

  const randomUser = predif + uuidv4() + "@gmail.com";
  const ranromUserName = predif + uuidv4();
  const randomPassword = "12346789";

  const [formData, setFormData] = useState<FormData>({
    email: randomUser,
    name: ranromUserName,
    password: randomPassword,
    confirmPassword: randomPassword,
    acceptTerms: false,
  });

  interface FormErrors {
    email?: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
    acceptTerms?: string;
    submit?: string;
  }

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof FormErrors;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const user = await HandleSignnup(formData);

        if (!user || typeof user !== "string") {
          throw new Error("Failed to create account. Please try again.");
        }

        onSuccess(user);
      } catch (error) {
        if (error instanceof Error) {
          setErrors((prev) => ({
            ...prev,
            submit: error.message,
          }));

          toast.error(error.message);
        } else {
          setErrors((prev) => ({
            ...prev,
            submit: "Failed to create account. Please try again.",
          }));

          toast.error("Failed to create account. Please try again.");
        }
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className=" pb-4 px-4 ">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black">Create your account</h2>
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

            {/* / Name Field / */}

            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-black text-left"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-black"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-black text-left"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-black"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-black text-left"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-black"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <label
                htmlFor="acceptTerms"
                className="ml-2 text-sm text-gray-700"
              >
                I accept the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* Login Link
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{' '}
                            <button onClick={setModes('signin')} className="text-blue-600 hover:underline font-medium">
                                Sign in
                            </button>
                        </p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
