interface StrapiErrorsProps {
    message: string | null;
    name: string;
    status: string | null;
  }
  
  export function StrapiErrors( { error, isSuccess = false }: { readonly error: StrapiErrorsProps | null, isSuccess?: boolean }) {
    if (!error?.message) return null;
    
    const className = isSuccess 
      ? "text-green-600 text-md py-2" 
      : "text-pink-500 text-md italic py-2";
    
    return <div className={className}>{error.message}</div>;
  }