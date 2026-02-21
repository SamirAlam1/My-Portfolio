const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
};

const LoadingSpinner = ({ size = 'md', className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div
      className={`${sizes[size]} border-slate-600 border-t-blue-500 rounded-full animate-spin`}
    />
  </div>
);

export default LoadingSpinner;