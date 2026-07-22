import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScrollToTop from "./component/ScrollToTop";
import AIButton from "./component/AI/AIButton";
import AIChat from "./component/AI/AIChat";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ScrollToTop />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />

      <Outlet />

      <AIButton
        onClick={() => setIsChatOpen(true)}
      />

      <AIChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default App;