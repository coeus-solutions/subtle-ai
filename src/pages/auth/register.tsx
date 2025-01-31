import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/lib/auth-context';

const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export function RegisterPage() {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await register(values.email, values.password);
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <main className="flex flex-col justify-center min-h-screen py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="text-center text-gray-300">
            Start generating subtitles in minutes
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-xl py-8 px-4 shadow-xl border border-white/10 sm:rounded-xl sm:px-10">
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-6">
                <FormField
                  name="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                  disabled={isSubmitting}
                  darkMode
                />
                <FormField
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  darkMode
                />
                
                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </Form>
            </Formik>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}