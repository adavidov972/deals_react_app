import React, { useState, useCallback } from "react";
import { BsFillTrashFill, BsPersonPlusFill } from "react-icons/bs";
import { HiOutlineDocument, HiOutlineUsers, HiOutlineOfficeBuilding } from "react-icons/hi";
// import { format } from "date-fns";

const DealDetailsPage = () => {
  const [formData, setFormData] = useState({
    block: "",
    parcel: "",
    subParcel: "",
    area: "",
    address: "",
    city: "",
    contractDate: "",
    price: "",
    tabu: "",
    rightsKind: "",
    taxOffice: "",
    ptor: ""
  });

  const [sellers, setSellers] = useState([{
    lastName: "",
    firstName: "",
    idKind: "",
    id: "",
    parts: "",
    isFirm: false
  }]);

  const [buyers, setBuyers] = useState([{
    lastName: "",
    firstName: "",
    idKind: "",
    id: "",
    parts: "",
    isFirm: false
  }]);

  const dropdownOptions = {
    tabu: ["Option 1", "Option 2", "Option 3"],
    rightsKind: ["Type 1", "Type 2", "Type 3"],
    taxOffice: ["Office 1", "Office 2", "Office 3"],
    ptor: ["Yes", "No"],
    idKind: ["Passport", "ID Card", "Driver License"]
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartyChange = (index, field, value, party) => {
    const updateFunction = party === "seller" ? setSellers : setBuyers;
    const currentParty = party === "seller" ? sellers : buyers;

    const updatedParty = currentParty.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });

    updateFunction(updatedParty);
  };

  const addParty = (party) => {
    const updateFunction = party === "seller" ? setSellers : setBuyers;
    const currentParty = party === "seller" ? sellers : buyers;

    updateFunction([...currentParty, {
      lastName: "",
      firstName: "",
      idKind: "",
      id: "",
      parts: "",
      isFirm: false
    }]);
  };

  const removeParty = (index, party) => {
    const updateFunction = party === "seller" ? setSellers : setBuyers;
    const currentParty = party === "seller" ? sellers : buyers;

    updateFunction(currentParty.filter((_, i) => i !== index));
  };

  const PartyTable = useCallback(({ party, data, onAdd, onRemove }) => (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <HiOutlineUsers className="text-blue-500 text-xl" />
          <h2 className="text-lg font-medium text-gray-700">{party === "seller" ? "Sellers" : "Buyers"}</h2>
        </div>
        <button
          onClick={() => onAdd()}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <BsPersonPlusFill />
          Add {party === "seller" ? "Seller" : "Buyer"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Kind</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">Parts</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">Is Firm</th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.lastName}
                    onChange={(e) => handlePartyChange(index, "lastName", e.target.value, party)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.firstName}
                    onChange={(e) => handlePartyChange(index, "firstName", e.target.value, party)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={item.idKind}
                    onChange={(e) => handlePartyChange(index, "idKind", e.target.value, party)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select</option>
                    {dropdownOptions.idKind.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.id}
                    onChange={(e) => handlePartyChange(index, "id", e.target.value, party)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.parts}
                    onChange={(e) => handlePartyChange(index, "parts", e.target.value, party)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={item.isFirm}
                    onChange={(e) => handlePartyChange(index, "isFirm", e.target.checked, party)}
                    className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                  >
                    <BsFillTrashFill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ), []);
  

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <HiOutlineDocument className="text-3xl text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Deal Details</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineOfficeBuilding className="text-xl text-blue-500" />
            <h2 className="text-lg font-medium text-gray-700">Property Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                <input
                  type="text"
                  name="block"
                  value={formData.block}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parcel</label>
                <input
                  type="text"
                  name="parcel"
                  value={formData.parcel}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Parcel</label>
                <input
                  type="text"
                  name="subParcel"
                  value={formData.subParcel}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Date</label>
                <input
                  type="date"
                  name="contractDate"
                  value={formData.contractDate}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tabu</label>
                <select
                  name="tabu"
                  value={formData.tabu}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  {dropdownOptions.tabu.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rights Kind</label>
                <select
                  name="rightsKind"
                  value={formData.rightsKind}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  {dropdownOptions.rightsKind.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Office</label>
                <select
                  name="taxOffice"
                  value={formData.taxOffice}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  {dropdownOptions.taxOffice.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ptor</label>
                <select
                  name="ptor"
                  value={formData.ptor}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  {dropdownOptions.ptor.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <PartyTable
          party="seller"
          data={sellers}
          onAdd={() => addParty("seller")}
          onRemove={(index) => removeParty(index, "seller")}
        />

        <PartyTable
          party="buyer"
          data={buyers}
          onAdd={() => addParty("buyer")}
          onRemove={(index) => removeParty(index, "buyer")}
        />

        <div className="mt-6 flex justify-center gap-4">
          <button
            className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            onClick={() => console.log({ formData, sellers, buyers })}
          >
            Save Deal
          </button>
          <button
            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            onClick={() => console.log('Save and Create Documents')}
          >
            Save & Create Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealDetailsPage;