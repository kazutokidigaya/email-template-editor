import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomePage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoaing] = useState(false);
  const navigate = useNavigate();

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoaing(true);
      try {
        const response = await axios.get("/email/templates?category=constant");
        setTemplates(response.data); // Save fetched templates
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to fetch templates. Please try again.");
      }
      setLoaing(false);
    };

    fetchTemplates();
  }, []);

  const handlePreview = (template) => {
    const newWindow = window.open();
    newWindow.document.write(template.layoutHTML); // Use layoutHTML instead of content
    newWindow.document.close();
  };

  const handleEdit = (template) => {
    navigate("/editor", { state: { template } });
  };

  return (
    <div className="p-8 bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="min-h-screen bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <header className="text-center py-10  bg-white text-gray-900 rounded-t-lg">
          <h1 className="text-5xl font-bold mb-4">Email Template Builder</h1>
          <p className="text-lg">
            Create, customize, and download professional email templates
            effortlessly.
          </p>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-10 bg-gray-50">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Why You'll Love Using Our Email Builder
          </h2>
          <div className="space-y-12 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-hand-pointer text-4xl"></i>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Intuitive and Easy to Use
                </h3>
                <p className="text-gray-600 mt-2">
                  Easily preview templates, make edits in our console, and check
                  how they look across different devices and email clients.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-green-100 text-green-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-edit text-4xl"></i>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Full Editing Control
                </h3>
                <p className="text-gray-600 mt-2">
                  Add columns, text, videos, and much more using the components
                  section in the editor. Customize colors, backgrounds, and text
                  styles with ease.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-purple-100 text-purple-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-sort text-4xl"></i>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Flexible Layouts
                </h3>
                <p className="text-gray-600 mt-2">
                  Rearrange sections within the template to fit your desired
                  structure. Drag-and-drop functionality makes this seamless.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-yellow-100 text-yellow-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-mobile-alt text-4xl"></i>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Responsive and Optimized
                </h3>
                <p className="text-gray-600 mt-2">
                  Test how your template looks on different screen sizes and
                  ensure it’s ready for mobile, tablet, or desktop users.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-pink-100 text-pink-500 flex items-center justify-center rounded-full">
                  <i className="fas fa-save text-4xl"></i>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  Save and Download Templates
                </h3>
                <p className="text-gray-600 mt-2">
                  After making your changes, save the template and download it
                  as an HTML file to use wherever you need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}

        <section className="py-10 px-6">
          <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Choose a Template
          </h2>
          {loading ? (
            <div className="w-full flex items-center justify-center p-10">
              <div
                disabled
                type="button"
                class="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border-2  hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center border-blue-500"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
                Loading Templates...
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* No Templates Found */}
              {templates.length === 0 && (
                <p className="text-center text-gray-500 col-span-full">
                  No templates found. Please add templates to start.
                </p>
              )}

              {/* Render Templates */}
              {templates.map((template, index) => (
                <div
                  key={index}
                  className="bg-gray-100 shadow-md rounded-lg overflow-hidden group relative hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Template Preview */}
                  <div
                    className="h-72 w-full bg-gray-200"
                    dangerouslySetInnerHTML={{ __html: template.layoutHTML }} // Use layoutHTML
                  ></div>

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <button
                      className="w-24 py-2 text-blue-500 bg-white border-2 border-blue-200 hover:text-white font-semibold rounded mb-2 hover:bg-blue-600"
                      onClick={() => handlePreview(template)}
                    >
                      Preview
                    </button>
                    <button
                      className="w-24 py-2 text-green-500 bg-white border-2 border-green-200 hover:text-white font-semibold rounded hover:bg-green-600"
                      onClick={() => handleEdit(template)}
                    >
                      Edit
                    </button>
                  </div>

                  {/* Template Name */}
                  <div className="p-4 relative z-30 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {template.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
