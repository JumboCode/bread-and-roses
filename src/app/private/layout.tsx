import SideNavBar from "@components/SideNavBar";
import TopHeader from "@components/TopHeader";

interface IHomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <SideNavBar role="admin" />
      <div className="flex-1 ml-60">
        <TopHeader userType="admin" />
        <div className="py-6 px-7">{children}</div>
      </div>
    </div>
  );
};

export default HomeLayout;
