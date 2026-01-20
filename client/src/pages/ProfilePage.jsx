import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
      setSelectedImg(authUser.profilePic || null);
    }
  }, [authUser]);

       const handleSubmit = async (e) => {
  e.preventDefault();

  // If no new image selected OR image is already a string
  if (!selectedImg || !(selectedImg instanceof File)) {
    await updateProfile({
      fullName: name,
      bio,
    });
    navigate("/");
    return;
  }

  // Only runs when selectedImg is a File
  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);

  reader.onload = async () => {
    const base64Image = reader.result;
    await updateProfile({
      profilePic: base64Image,
      fullName: name,
      bio,
    });
    navigate("/");
  };
};

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                assets.avatar_icon
              }
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            Upload profile image
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            required
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={
            selectedImg instanceof File
              ? URL.createObjectURL(selectedImg)
              : selectedImg || assets.logo_icon
          }
          alt="logo"
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
