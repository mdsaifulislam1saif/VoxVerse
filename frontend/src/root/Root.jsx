import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function Root() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-50 antialiased bg-white"
      // relative: allows positioning of child elements if needed
      // min-h-screen: ensures the layout covers full viewport height
      // overflow-x-hidden: prevents horizontal scroll
      // text-slate-50: sets default text color
      // antialiased: smoothens font rendering
      // bg-white: sets background color
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
export default Root;