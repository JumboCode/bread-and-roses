import { useState } from "react";
import { addUser } from "@api/user/route.client";
import { Role } from "@prisma/client";

interface CreateUserForm {
  setUserID: (id: string) => void;
}

const CreateUserForm = ({ setUserID }: CreateUserForm) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: Role.VOLUNTEER,
    ageOver14: false,
    country: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    hasLicense: false,
    speaksEsp: false,
    volunteerType: "",
    hoursWorked: 0,
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : name === "hoursWorked"
        ? parseInt(value) || 0
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addUser(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        },
        {
          ageOver14: formData.ageOver14,
          firstTime: false,
          country: formData.country,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          hasLicense: formData.hasLicense,
          speaksEsp: formData.speaksEsp,
          volunteerType: formData.volunteerType,
          hoursWorked: formData.hoursWorked,
          whyJoin: "",
          comments: "",
        }
      );
      setUserID(response.data.id);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-gray-100 rounded">
      <h2 className="text-lg font-bold">Create User</h2>

      {/* User Details */}
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input"
        >
          <option value="VOLUNTEER">Volunteer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Volunteer Details */}
      <div>
        <label>
          <input
            type="checkbox"
            name="ageOver14"
            checked={formData.ageOver14}
            onChange={handleChange}
          />
          Age Over 14
        </label>
      </div>
      <div>
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Zip Code</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="hasLicense"
            checked={formData.hasLicense}
            onChange={handleChange}
          />
          Has License
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="speaksEsp"
            checked={formData.speaksEsp}
            onChange={handleChange}
          />
          Speaks Spanish
        </label>
      </div>
      <div>
        <label>Volunteer Type</label>
        <select name="role" id="role">
          <option value={Role.ADMIN}>Admin</option>
          <option value={Role.VOLUNTEER}>Volunteer</option>
        </select>
      </div>
      <div>
        <label>Hours Worked</label>
        <input
          type="number"
          name="hoursWorked"
          value={formData.hoursWorked}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="string"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input"
        />
      </div>

      <button type="submit" className="btn-primary">
        Add User
      </button>
    </form>
  );
};

export default CreateUserForm;
