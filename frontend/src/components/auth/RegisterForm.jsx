import { Link } from 'react-router-dom';
import { useRegister } from '../../hook/useRegister';

const RegisterForm = () => {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    error,
    loading,
    handleChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword
  } = useRegister();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 font-medium">{error}</div>}

            <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500" />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? "🙈" : "👁"}</button>
            </div>

            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 text-black border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? "🙈" : "👁"}</button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
