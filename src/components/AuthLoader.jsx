const AuthLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#09090b]">
    <div className="flex items-end gap-1.5 h-8">
      <div className="w-1.5 bg-blue-500 rounded-full animate-[loading-bar_1s_ease-in-out_infinite]" />
      <div className="w-1.5 bg-blue-500 rounded-full animate-[loading-bar_1s_ease-in-out_0.1s_infinite]" />
      <div className="w-1.5 bg-blue-500 rounded-full animate-[loading-bar_1s_ease-in-out_0.2s_infinite]" />
      <div className="w-1.5 bg-blue-500 rounded-full animate-[loading-bar_1s_ease-in-out_0.3s_infinite]" />
    </div>

    <style
      dangerouslySetInnerHTML={{
        __html: `
      @keyframes loading-bar {
        0%, 100% { height: 12px; opacity: 0.3; }
        50% { height: 32px; opacity: 1; }
      }
    `,
      }}
    />
  </div>
);

export default AuthLoader;
