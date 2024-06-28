import { useNavigate } from 'react-router-dom';

const LoginPanel = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-8">Learnify Login Panel !</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleNavigation('/student-login')}
            className="w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            Student Zone
          </button>
          <button
            onClick={() => handleNavigation('/admin-login')}
            className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Admin Zone
          </button>
          <button
            onClick={() => handleNavigation('/franchise-login')}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
          >
            Franchise Zone
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;
