import VolunteerTable from "@components/VolunteerTable/VolunteerTable";
import SearchBar from "@components/SearchBar";

const VolunteerHomePage = () => {
  return (
    <div>
      <h1> Volunteer Home</h1>
      <SearchBar Title="hi" Subtext="yo"/>
      <VolunteerTable></VolunteerTable>
    </div>
  );
};

export default VolunteerHomePage;
