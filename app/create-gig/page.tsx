// components/CreateGig.tsx

'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import FilePond and plugins
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePondFile } from 'filepond';

// Import styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImagePreview);

// Import the Markdown editor dynamically (SSR compatibility)
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';



// Import icons
import { FaBullseye, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

// Import SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Import useRouter from Next.js
import { useRouter } from 'next/router';

const MySwal = withReactContent(Swal);

const mdParser = new MarkdownIt();

interface FormData {
  title: string;
  description: string;
  bannerImage: string;
  markDownCode: string;
  goal: string;
  deadline: string;
}

export default function CreateGig() {
  const [username, setUsername] = useState<string>('');
  const [paymentPointer, setPaymentPointer] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    bannerImage: '',
    markDownCode: '',
    goal: '',
    deadline: '',
  });
  const [bannerFile, setBannerFile] = useState<FilePondFile[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [showFullScreenPreview, setShowFullScreenPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [isSaving, setIsSaving] = useState<boolean>(false); // Saving state
  const [paymentPointerError, setPaymentPointerError] = useState<string>(''); // Validation error
  

  // Define the regex for validating payment pointer
  const paymentPointerRegex = /^\$ilp\.interledger-test\.dev\/\w+$/;

  // Fetch user session and payment pointer
  const fetchSessionAndPaymentPointer = async () => {
    try {
      // Fetch session
      const sessionResponse = await fetch('/api/auth/session');
      const sessionData = await sessionResponse.json();

      console.log('Session Data:', sessionData); // Debugging

      // If no user, redirect to login
      if (!sessionData.user) {
        window.location.href = '/';
        return;
      }

      setUsername(sessionData.user.email);

      // Fetch payment pointer using the API
      const paymentPointerResponse = await fetch('/api/fetch-payment-pointer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sessionData.user.email }),
      });

      console.log('Fetch Payment Pointer Response Status:', paymentPointerResponse.status); // Debugging

      if (!paymentPointerResponse.ok) {
        const errorData = await paymentPointerResponse.json();
        console.error('Fetch Payment Pointer Error:', errorData); // Debugging

        if (paymentPointerResponse.status === 404 || paymentPointerResponse.status === 400) {
          // Payment pointer not found or bad request, redirect to /profile
          window.location.href = '/profile';
          return;
        }

        throw new Error(errorData.message || 'Failed to fetch payment pointer.');
      }

      const paymentData = await paymentPointerResponse.json();
      console.log('Fetched Payment Pointer:', paymentData.paymentPointer); // Debugging

      if (!paymentData.paymentPointer) {
        // If payment pointer is null or empty, redirect to /profile
        window.location.href = '/profile';
        return;
      }

      setPaymentPointer(paymentData.paymentPointer);
    } catch (error: any) {
      console.error('Error during session or payment pointer fetch:', error);
      // Optionally, you can redirect to an error page or show a notification
      Swal.fire('Error', 'An error occurred while verifying your payment pointer.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndPaymentPointer();
  }, []);

  // Handle input change with validation for payment pointer
  const handlePaymentPointerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, bannerImage: value })); // Adjust if needed
    setPaymentPointer(value);

    // Validate the payment pointer
    if (!paymentPointerRegex.test(value)) {
      setPaymentPointerError(
        'Invalid format. It should be like $ilp.interledger-test.dev/testaccount'
      );
    } else {
      setPaymentPointerError('');
    }
  };

  // Handle other input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle markdown editor change
  const handleEditorChange = ({
    html,
    text,
  }: {
    html: string;
    text: string;
  }) => {
    setFormData((prevFormData) => ({ ...prevFormData, markDownCode: text }));
  };

  // Handle image upload for markdown editor (optional)
  const handleImageUpload = async (file: File): Promise<string> => {
    // Implement image upload logic if needed
    // For now, return a placeholder image URL
    return 'https://via.placeholder.com/150';
  };

  // Handle FilePond file updates
  const handleBannerImageUpload = (files: FilePondFile[]) => {
    setBannerFile(files);

    if (files.length > 0) {
      const fileItem = files[0];
      if (fileItem.file instanceof Blob) {
        // Local file, read as data URL
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const result = event.target?.result as string;
          setBannerPreview(result);
          setFormData((prevFormData) => ({ ...prevFormData, bannerImage: result }));
        };
        reader.readAsDataURL(fileItem.file);
      } else {
        // Remote file, use the source URL
        const source = fileItem.source as string;
        setBannerPreview(source);
        setFormData((prevFormData) => ({ ...prevFormData, bannerImage: source }));
      }
    } else {
      setBannerPreview('');
      setFormData((prevFormData) => ({ ...prevFormData, bannerImage: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if there's a validation error
    if (paymentPointerError) {
      MySwal.fire('Error', 'Please correct the errors before saving.', 'error');
      return;
    }

    // Additional check in case the user tries to bypass client-side validation
    if (!paymentPointerRegex.test(paymentPointer || '')) {
      setPaymentPointerError(
        'Invalid format. It should be like $ilp.interledger-test.dev/testaccount'
      );
      MySwal.fire('Error', 'Payment Pointer format is invalid.', 'error');
      return;
    }

    try {
      setIsSaving(true); // Disable the save button and show spinner

      // Show loading Swal dialog
      Swal.fire({
        title: 'Submitting Your Gig',
        text: 'Please wait while we process your gig...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Combine formData and username
      const dataToSend = {
        ...formData,
        username: username,
      };

      // Send POST request to /api/createGig
      const response = await fetch('/api/createGig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Update Profile Response Status:', response.status); // Debugging

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create gig.');
      }

      const responseData = await response.json();

      console.log('Project created:', responseData.project);

      // projectid
      const projectid = responseData.project.id;

      // Hide the loading dialog
      Swal.close();

      // Show success dialog
      Swal.fire({
        title: 'Gig Created Successfully!',
        text: 'Your gig has been created.',
        icon: 'success',
      });

      // Redirect to /projects/[id]
      window.location.href = '/projects/' + projectid;

      // Reset the form
      setFormData({
        title: '',
        description: '',
        bannerImage: '',
        markDownCode: '',
        goal: '',
        deadline: '',
      });
      setBannerFile([]);
      setBannerPreview('');
    } catch (error: any) {
      console.error('Error creating gig:', error);

      // Hide the loading dialog
      Swal.close();

      // Show error dialog
      Swal.fire({
        title: 'Submission Failed',
        text: error.message || 'There was an error submitting your gig. Please try again.',
        icon: 'error',
      });
    } finally {
      setIsSaving(false); // Re-enable the save button
    }
  };

  // Toggle full-screen preview
  const toggleFullScreenPreview = () => {
    setShowFullScreenPreview(!showFullScreenPreview);
  };

  // Handle AI content generation
  const handleGenerateWithAI = async () => {
    // Show Swal prompt for initial prompt
    const { value: initialPrompt } = await Swal.fire({
      title: 'Generate with AI',
      html:
        '<textarea id="swal-input1" class="swal2-textarea" placeholder="Enter a brief description or idea for your project"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Generate',
      preConfirm: () => {
        const prompt = (document.getElementById('swal-input1') as HTMLTextAreaElement).value.trim();
        if (!prompt) {
          Swal.showValidationMessage('Please enter a description or idea for your project.');
          return;
        }
        return prompt;
      },
    });

    if (initialPrompt) {
      try {
        // Show loading Swal dialog
        Swal.fire({
          title: 'Generating Content with AI',
          text: 'Please wait while we generate your project details...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Send POST request to /api/generateContent
        const contentResponse = await fetch('/api/generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initialPrompt }),
        });

        if (!contentResponse.ok) {
          const errorData = await contentResponse.json();
          throw new Error(errorData.error || 'Failed to generate content.');
        }

        const contentData = await contentResponse.json();

        console.log('Content Data Received:', contentData);

        const { projectName: generatedName, projectDescription: generatedDescription, markdownWriteUpCode } = contentData;

        // Ensure that markdownWriteUpCode is a string
        if (typeof markdownWriteUpCode !== 'string') {
          throw new Error('Generated markdownWriteUpCode is not a string.');
        }

        // Update formData with generated content
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: generatedName,
          description: generatedDescription,
          markDownCode: markdownWriteUpCode,
        }));

        // Hide the loading dialog
        Swal.close();

        // Optionally, notify the user
        Swal.fire({
          title: 'AI Generated Successfully!',
          text: 'Your project details have been generated.',
          icon: 'success',
        });
      } catch (error: any) {
        // Hide the loading dialog
        Swal.close();

        // Show error dialog
        Swal.fire({
          title: 'Error',
          text: error.message || 'An unexpected error occurred.',
          icon: 'error',
        });
      }
    }
  };

  // Handle Banner Image Generation
  const handleGenerateBanner = async () => {
    // Show Swal prompt for banner description
    const { value: bannerPrompt } = await Swal.fire({
      title: 'Generate Banner Image',
      html:
        '<textarea id="swal-banner-input" class="swal2-textarea" placeholder="Enter a description or idea for your banner image"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Generate',
      preConfirm: () => {
        const prompt = (document.getElementById('swal-banner-input') as HTMLTextAreaElement).value.trim();
        if (!prompt) {
          Swal.showValidationMessage('Please enter a description or idea for your banner image.');
          return;
        }
        return prompt;
      },
    });

    if (bannerPrompt) {
      try {
        // Show loading Swal dialog
        Swal.fire({
          title: 'Generating Banner Image',
          text: 'Please wait while we generate your banner image...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Send POST request to /api/generateImage
        const imageResponse = await fetch('/api/generateImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: bannerPrompt }),
        });

        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(errorData.error || 'Failed to generate image.');
        }

        const imageData = await imageResponse.json();
        const imageURL = imageData.imageUrl;

        // Fetch the image from the server-side API to bypass CORS
        const downloadResponse = await fetch('/api/downloadImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: imageURL }),
        });

        if (!downloadResponse.ok) {
          const errorData = await downloadResponse.json();
          throw new Error(errorData.error || 'Failed to download image.');
        }

        const blob = await downloadResponse.blob();

        // Create a File object
        const file = new File([blob], 'banner.png', { type: blob.type });

        // Update FilePond's files state
        setBannerFile([
          {
            source: file,
            //@ts-ignore
            options: {
              type: 'local',
            },
          },
        ]);

        // Create a Blob URL for the preview
        const blobUrl = URL.createObjectURL(blob);

        setBannerPreview(blobUrl);
        setFormData((prevFormData) => ({ ...prevFormData, bannerImage: blobUrl }));

        Swal.close();

        // Notify the user
        Swal.fire({
          title: 'Banner Generated Successfully!',
          text: 'Your banner image has been generated and added to the upload list.',
          icon: 'success',
        });
      } catch (error: any) {
        Swal.close();

        Swal.fire({
          title: 'Error',
          text: error.message || 'An unexpected error occurred while generating the banner image.',
          icon: 'error',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Container */}
      <div className="container mx-auto px-5 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Create a New Gig</h1>

        {/* Generate with AI and Generate Banner Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={handleGenerateWithAI}
            className="rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate with AI
          </button>
          <button
            onClick={handleGenerateBanner}
            className="rounded-lg bg-green-500 px-6 py-3 text-lg font-semibold text-white shadow hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Generate Banner
          </button>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row lg:space-x-10">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="lg:w-1/2 bg-white p-8 rounded-lg shadow-md"
          >
            {/* Title */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Title</label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="title"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Description</label>
              <textarea
                name="description"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            {/* Goal */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Goal Amount ($)</label>
              <div className="flex items-center">
                <FaBullseye className="text-green-500 mr-2" />
                <input
                  type="number"
                  name="goal"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.goal}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Deadline</label>
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-500 mr-2" />
                <input
                  type="date"
                  name="deadline"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Banner Image */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Banner Image</label>
              <FilePond
                // @ts-ignore
                files={bannerFile}
                onupdatefiles={handleBannerImageUpload}
                allowMultiple={false}
                maxFiles={1}
                name="banner"
                labelIdle='Drag & Drop your banner image or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={['image/*']}
                server={{
                  // Disable FilePond's server-side processing since we're handling uploads manually
                  process: null,
                  revert: null,
                  restore: null,
                  load: (source, load, error, progress, abort) => {
                    // Load image from the source URL
                    fetch(source)
                      .then(response => response.blob())
                      .then(blob => {
                        load(blob);
                      })
                      .catch(() => {
                        error('Could not load image');
                      });
                  },
                }}
              />
            </div>

            {/* Markdown Editor */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">Content</label>
              <MdEditor
                value={formData.markDownCode}
                style={{ height: '400px' }}
                renderHTML={(text: string) => mdParser.render(text)}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: false, // Hide the default HTML preview
                  },
                  canView: {
                    menu: true,
                    md: true,
                    html: false,
                    fullScreen: false, // Disable full-screen mode
                    hideMenu: false,
                  },
                  markdownClass: 'markdown-editor-custom', // Custom class for styling
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className={`rounded-lg bg-green-500 px-10 py-3 text-lg font-semibold text-white shadow hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Create Gig'
                )}
              </button>
            </div>
          </form>

          {/* Preview Section */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Preview</h2>
              <button
                onClick={toggleFullScreenPreview}
                className="text-green-500 hover:text-green-600 focus:outline-none"
                title="Full Screen Preview"
              >
                <FaExternalLinkAlt size={24} />
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Banner Image */}
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="w-full h-auto rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                  Banner Image Preview
                </div>
              )}

              {/* Goal and Deadline */}
              <div className="flex items-center mb-4">
                <FaBullseye className="text-green-500 mr-2" />
                <span className="mr-4">
                  Goal: ${formData.goal || 'Amount'}
                </span>
                <FaCalendarAlt className="text-green-500 mr-2" />
                <span>
                  Deadline: {formData.deadline || 'Date'}
                </span>
              </div>

              {/* Markdown Content */}
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      formData.markDownCode || 'Your content will appear here.'
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showFullScreenPreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Full Screen Preview</h2>
              <button
                onClick={toggleFullScreenPreview}
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                title="Close Preview"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div>
              {/* Banner Image */}
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="w-full h-auto rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                  Banner Image Preview
                </div>
              )}

              {/* Goal and Deadline */}
              <div className="flex items-center mb-4">
                <FaBullseye className="text-green-500 mr-2" />
                <span className="mr-4">
                  Goal: ${formData.goal || 'Amount'}
                </span>
                <FaCalendarAlt className="text-green-500 mr-2" />
                <span>
                  Deadline: {formData.deadline || 'Date'}
                </span>
              </div>

              {/* Markdown Content */}
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdParser.render(
                      formData.markDownCode || 'Your content will appear here.'
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        /* Adjust the editor */
        .markdown-editor-custom .editor-container {
          display: flex;
          flex-direction: column;
        }

        /* Increase font size and line height for better readability */
        .markdown-editor-custom .input {
          font-size: 16px;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
