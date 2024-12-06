import SideNavBar from "@components/SideNavBar";

interface IHomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: IHomeLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <SideNavBar role="admin" />
      <main className="flex-1 ml-60">{children}</main>
    </div>
  );
};

export default HomeLayout;
