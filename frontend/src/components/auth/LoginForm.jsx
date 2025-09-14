import { Link } from 'react-router-dom';
import { useLogin } from '../../hook/useLogin';

const LoginForm = () => {
  // Destructure values and functions from custom hook useLogin
  const { 
    username, setUsername, 
    password, setPassword, 
    showPassword, setShowPassword, 
    error, loading, 
    handleSubmit 
  } = useLogin();
  return (
    // Full-page wrapper with gradient background, centers content
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        </div>
        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 font-medium">
                {error}
              </div>
            )}
            {/* Username input */}
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" 
            />
            {/* Password input with toggle visibility */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 pr-10" 
              />
              {/* Eye/Hide password toggle button */}
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {/* Submit button with loading state */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {/* Link to registration page */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
