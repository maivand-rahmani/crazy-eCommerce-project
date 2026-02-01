import React from "react";

const OAuthForm = () => {
  return (
    <form className="w-full space-y-3">
      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <img
          src="/icons/google-color.png"
          width={18}
          height={18}
          alt="Google"
        />
        <span>Continue with Google</span>
      </button>

      <button
        type="button"
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <img src="/icons/github.png" width={18} height={18} alt="GitHub" />
        <span>Continue with GitHub</span>
      </button>
    </form>
  );
};

export default OAuthForm;
