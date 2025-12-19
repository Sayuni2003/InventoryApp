import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar username="Sayuni" />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
