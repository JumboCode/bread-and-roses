import VolunteerTable from "@components/VolunteerTable/VolunteerTable";

const AdminHomePage = () => {
  return (
    <div>
      <h1>Admin Home</h1>
      <div style={{padding: "30px" }}>
        <VolunteerTable />
      </div>
    </div>
  );
};

export default AdminHomePage;
