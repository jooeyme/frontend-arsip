import { useState } from "react";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../components/icons";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { Login } from "../../modules/fetch/user";
import axios from "axios";
// import PageMeta from "../../components/common/PageMeta";

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await Login({ email, password });
      const { token } = response;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = token;
      navigate('/dashboard')
    } catch (error) {
      // Handle login error
      setError('Invalid email or password');
      console.error('Login error:', error.message);
    }
  }  

  return (
    <>
      {/* <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="w-full max-w-md pt-10 mx-auto">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
                <img src={ChevronLeftIcon} alt="Grid Icon"/>
              {/* <ChevronLeftIcon /> */}
              Back to dashboard
            </Link>
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                
                <form onSubmit={handleLogin}>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input 
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">
                        Password <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <img src={EyeIcon} alt="Grid Icon" className="fill-gray-500 dark:fill-gray-400"/>
                            // <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <img src={EyeCloseIcon} alt="Grid Icon" className="fill-gray-500 dark:fill-gray-400"/>
                            // <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isChecked} onChange={setIsChecked} />
                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                          Keep me logged in
                        </span>
                      </div>
                      <Link
                        to="/"
                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div>
                      <Button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700" size="sm">
                        Sign in
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Don't have an account? {""}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex">
          {/* <!-- ===== Common Grid Shape Start ===== --> */}
          <GridShape />
          <div className="flex flex-col items-center max-w-md">
            <Link to="/" className="block mb-4">
              <img src="./images/logo/E1 - Logo IPB University Vertical Departemen Warna-Lo.png" alt="Logo" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
