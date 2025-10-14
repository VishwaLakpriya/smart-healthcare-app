export const H1 = ({ children }: any) => (
  <h1 className="text-[48px] font-extrabold text-[#1A6C8C] mb-8">{children}</h1>
);

export const Panel = ({ children, className="" }: any) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-[#C7D6DF] ${className}`}>{children}</div>
);

export const Button = ({ variant="primary", className="", ...props }: any) => {
  const base = "rounded-xl px-6 py-4 text-lg font-semibold transition";
  const styles: Record<string,string> = {
    primary: "bg-[#1E6E8D] text-white hover:bg-[#195D78]",
    outline: "border-2 border-[#1E6E8D] text-[#1E6E8D] bg-white hover:bg-[#E6F2F7]",
    ghost: "text-[#1E6E8D] hover:bg-[#E6F2F7]",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
};
