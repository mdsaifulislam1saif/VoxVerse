import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Enter your password",
  showPassword,
  setShowPassword 
}) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition duration-200"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;