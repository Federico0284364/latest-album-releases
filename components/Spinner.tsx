type Props = {
  className?: string;
};

export default function Spinner({ className }: Props) {
  return (
    <div className={`flex justify-center items-center ${className ?? ''}`}>
      <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
    </div>
  );
}
