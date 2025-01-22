import React, { useEffect, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import axios from "../api/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./Editor.css";

const Editor = () => {
  const location = useLocation();
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const selectedTemplate = location?.state?.template?.layoutHTML || "";

  useEffect(() => {
    const editor = grapesjs.init({
      container: "#gjs",
      height: "80vh",
      width: "90%",
      fromElement: true,
      plugins: ["grapesjs-preset-webpage", "grapesjs-plugin-forms"],
      pluginsOpts: {
        "grapesjs-preset-webpage": {},
        "grapesjs-plugin-forms": {},
      },

      assetManager: {
        upload: true,
        uploadName: "image",
        uploadText: "Drag and drop your image here or click to upload",
        uploadFile: async (event) => {
          const file = event.dataTransfer
            ? event.dataTransfer.files[0]
            : event.target.files[0];
          const formData = new FormData();
          formData.append("image", file);

          try {
            const response = await axios.post("/image/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            const imageUrl = response.data.secure_url;

            editor.AssetManager.add({
              src: imageUrl,
              name: file.name,
            });

            return imageUrl;
          } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Image upload failed. Please try again.");
            return null;
          }
        },
        handleAdd: (assets) => {
          assets.forEach((asset) => {
            editor.AssetManager.add(asset);
          });
        },
      },
      storageManager: false,
    });

    if (selectedTemplate) {
      editor.setComponents(selectedTemplate);
    }

    // add Basic componenets

    editor.BlockManager.add("1-column", {
      label: "1 Column",
      content: '<div class="row"><div class="col">1 Column</div></div>',
      category: "Basic",
    });

    editor.BlockManager.add("2-columns", {
      label: "2 Columns",
      content:
        '<div class="row"><div class="col">Column 1</div><div class="col">Column 2</div></div>',
      category: "Basic",
    });

    editor.BlockManager.add("divider", {
      label: "Divider",
      content: "<hr/>",
      category: "Basic",
    });

    editor.BlockManager.add("heading", {
      label: "Heading",
      content: "<h1>Heading</h1>",
      category: "Basic",
    });

    editor.BlockManager.add("text", {
      label: "Text",
      content: "<p>This is a text block</p>",
      category: "Basic",
    });

    editor.BlockManager.add("link", {
      label: "Link",
      content: '<a href="#">Click Here</a>',
      category: "Basic",
    });

    editor.BlockManager.add("image", {
      label: "Image",
      content: '<img src="https://via.placeholder.com/150" alt="Placeholder"/>',
      category: "Basic",
    });

    editor.BlockManager.add("video", {
      label: "Video",
      content:
        '<iframe src="https://www.youtube.com/embed/xyz" width="560" height="315"></iframe>',
      category: "Basic",
    });

    editor.BlockManager.add("map", {
      label: "Map",
      content:
        '<iframe src="https://maps.google.com/maps?q=New+York&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="300"></iframe>',
      category: "Basic",
    });

    // Add Form Components
    editor.BlockManager.add("form", {
      label: "Form",
      content:
        '<form><input type="text" placeholder="Name"/><button type="submit">Submit</button></form>',
      category: "Forms",
    });

    editor.BlockManager.add("input", {
      label: "Input",
      content: '<input type="text" placeholder="Input Field"/>',
      category: "Forms",
    });

    editor.BlockManager.add("textarea", {
      label: "Textarea",
      content: '<textarea placeholder="Write something..."></textarea>',
      category: "Forms",
    });

    editor.BlockManager.add("button", {
      label: "Button",
      content: '<button type="button">Button</button>',
      category: "Forms",
    });

    editor.BlockManager.add("checkbox", {
      label: "Checkbox",
      content: '<input type="checkbox"/> Checkbox',
      category: "Forms",
    });

    editor.BlockManager.add("radio", {
      label: "Radio",
      content: '<input type="radio" name="radio"/> Radio',
      category: "Forms",
    });

    setEditor(editor);
  }, [selectedTemplate]);

  const handleSaveTemplate = async () => {
    if (!editor) return;

    const layoutHTML = editor.getHtml();
    const layoutCSS = editor.getCss();
    const layoutJS = editor.getJs();
    const variables = {};

    editor.getComponents().forEach((component) => {
      const tag = component.get("tagName");
      variables[tag] = component.get("content");
    });
    setLoading(true);
    try {
      await axios.post("/email/save", {
        name: "Custom Template",
        layoutHTML,
        layoutCSS,
        layoutJS,
        variables,
      });
      toast.success("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save the template.");
    }
    setLoading(false);
  };

  const handleDownloadTemplate = async () => {
    if (!editor) return;

    const layoutHTML = editor.getHtml();
    const layoutCSS = editor.getCss();
    const layoutJS = editor.getJs();

    const variables = {
      name: "John Doe",
      heroImage: "https://via.placeholder.com/600x300",
      featureOne: "Feature One",
      featureTwo: "Feature Two",
    };

    try {
      const response = await axios.post("/email/render", {
        layoutHTML,
        layoutCSS,
        layoutJS,
        variables,
      });

      const blob = new Blob([response.data], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "template.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download the template.");
    }
  };

  // const sendEmail = async () => {
  //   if (!editor) return;

  //   const layoutHTML = editor.getHtml();
  //   const layoutCSS = editor.getCss();
  //   const layoutJS = editor.getJs();

  //   const variables = {
  //     name: "John Doe",
  //     heroImage: "https://via.placeholder.com/600x300",
  //     featureOne: "Feature One",
  //     featureTwo: "Feature Two",
  //   };

  //   try {
  //     // Send the rendered template to the backend
  //     await axios.post("/email/send", {
  //       layoutHTML,
  //       layoutCSS,
  //       layoutJS,
  //       variables,
  //       to: "2001karanpt@gmail.com", // Replace with the recipient's email
  //       subject: "Your Custom Email Template",
  //     });

  //     toast.success("Email sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send the email.");
  //   }
  // };

  return (
    <div className="p- bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex flex-col justify-between bg-gray-100">
        <header className="text-sm flex items-center justify-between gap-6 p-6 bg-white shadow-md">
          <button
            className="px-6 py-2 bg-gray-300 text-black font-semibold hover:bg-black hover:text-white rounded-md transition-colors duration-200"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <div className="flex gap-4">
            {loading ? (
              <div
                disabled
                type="button"
                className="px-6 py-2 text-green-500 bg-white border-2 border-green-200 hover:text-white font-semibold rounded mb-2 hover:bg-green-400 flex items-center justify-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600"
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
                Saving Changes...
              </div>
            ) : (
              <button
                onClick={handleSaveTemplate}
                className="px-6 py-2 text-green-500 bg-white border-2 border-green-200 hover:text-white font-semibold rounded mb-2 hover:bg-green-400"
              >
                Save Template
              </button>
            )}

            <button
              onClick={handleDownloadTemplate}
              className="px-6 py-2  text-blue-500 bg-white border-2 border-blue-200 hover:text-white font-semibold rounded mb-2 hover:bg-blue-400"
            >
              Download Template
            </button>
            {/* <button
              onClick={sendEmail}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Send Email
            </button> */}
          </div>
        </header>

        <main className="flex-grow flex justify-center items-center">
          <div id="gjs" className="h-[calc(100vh-120px)]"></div>
        </main>

        <footer className="py-4 bg-white shadow-inner">
          <p className="text-center text-sm text-gray-500">
            2025 @copyright reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Editor;
