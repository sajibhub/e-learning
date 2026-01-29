import React, { useState, useRef } from "react";
import {
  FaDownload,
  FaShareAlt,
  FaCheckCircle,
  FaAward,
  FaEye,
  FaTimes,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const certificateRef = useRef(null);

  /* ================= DATA ================= */

  const certificates = [
    {
      id: "CERT-2023-MERN-001",
      courseName: "MERN Stack Development",
      completionDate: "November 15, 2023",
      instructorName: "Mohammad Sajib",
      studentName: "John Doe",
    },
  ];

  /* ================= PDF ================= */

  const generatePDF = async () => {
    if (!certificateRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    const element = certificateRef.current;

    // Save old background
    const oldBg = element.style.background;

    try {
      // Force safe background (NO OKLCH)
      element.style.background =
        "linear-gradient(135deg, #1e1b4b, #1e40af, #581c87)";

      // Remove filters temporarily
      element
        .querySelectorAll("*")
        .forEach((el) => {
          el.style.filter = "none";
          el.style.backdropFilter = "none";
        });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);

      pdf.save(
        `${selectedCertificate.courseName.replace(/\s+/g, "-")}-Certificate.pdf`
      );

    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF generation failed.");

    } finally {
      // Restore background
      element.style.background = oldBg;

      setIsGeneratingPdf(false);
    }
  };


  /* ================= HANDLERS ================= */

  const handleView = (cert) => {
    setSelectedCertificate(cert);
    setShowModal(true);
    setShowShareOptions(false);
  };

  const handleDownload = (cert) => {
    setSelectedCertificate(cert);
    setShowModal(true);
    setShowShareOptions(false);

    // Wait a bit for the modal to render the certificate
    setTimeout(() => {
      generatePDF();
    }, 1000);
  };

  const handleShare = (cert) => {
    setSelectedCertificate(cert);
    setShowModal(true);
    setShowShareOptions(true);
  };

  /* ================= SHARE ================= */

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const text = `I completed ${selectedCertificate.courseName}!`;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;

      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?url=${url}`;
        break;

      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text} ${url}`;
        break;

      case "link":
        navigator.clipboard.writeText(url);
        alert("Link Copied!");
        return;

      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  /* ================= SIGNATURE ================= */

  const Signature = () => (
    <svg width="200" height="60" viewBox="0 0 200 60">
      <text
        x="10"
        y="40"
        fontSize="26"
        fill="white"
        fontFamily="cursive"
      >
        Mohammad Sajib
      </text>
    </svg>
  );

  /* ================= CERTIFICATE ================= */

  const CertificateDesign = ({ certificate }) => (
    <div
      ref={certificateRef}
      className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 rounded-xl shadow-2xl overflow-hidden w-full max-w-[900px] aspect-[3/2]"
    >
      <div className="relative p-12 h-full flex flex-col justify-between text-center">

        {/* Header */}
        <div>
          <FaAward className="mx-auto text-6xl text-yellow-400 mb-4" />

          <h2 className="text-4xl font-bold text-white mb-2">
            Certificate of Completion
          </h2>

          <div className="w-32 h-1 bg-yellow-400 mx-auto mb-6" />
        </div>

        {/* Body */}
        <div>
          <p className="text-xl text-yellow-200 mb-6">
            This certifies that
          </p>

          <h3 className="text-4xl font-bold text-white mb-6">
            {certificate.studentName}
          </h3>

          <p className="text-xl text-yellow-200 mb-2">
            has completed
          </p>

          <h4 className="text-3xl font-bold text-yellow-400 mb-6">
            {certificate.courseName}
          </h4>

          <p className="text-yellow-100">
            {certificate.completionDate}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">

          <div className="text-left">
            <p className="text-sm text-yellow-200 mb-1">
              Date
            </p>

            <p className="border-b border-yellow-400 w-40 text-white">
              {certificate.completionDate}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-yellow-200 mb-1">
              Signature
            </p>

            <Signature />
          </div>

        </div>

        {/* ID */}
        <p className="absolute bottom-2 right-4 text-xs text-yellow-200">
          ID: {certificate.id}
        </p>

      </div>
    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        My Certificates
      </h1>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-8">

        {certificates.map((cert) => (

          <div
            key={cert.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >

            <div className="flex flex-wrap gap-4 justify-between items-center mb-4">

              <h2 className="text-xl font-bold">
                {cert.courseName}
              </h2>

              <div className="flex gap-2">

                <button
                  onClick={() => handleView(cert)}
                  className="btn-blue"
                >
                  <FaEye /> View
                </button>

                <button
                  onClick={() => handleDownload(cert)}
                  className="btn-green"
                  disabled={isGeneratingPdf}
                >
                  <FaDownload /> {isGeneratingPdf ? "Generating..." : "Download"}
                </button>

                <button
                  onClick={() => handleShare(cert)}
                  className="btn-indigo"
                >
                  <FaShareAlt /> Share
                </button>

              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <FaCheckCircle className="text-green-500" />
              <span>{cert.completionDate}</span>
            </div>

            <p className="text-gray-600">
              Instructor:{" "}
              <span className="font-semibold">
                {cert.instructorName}
              </span>
            </p>

          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && selectedCertificate && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white max-w-6xl w-full rounded-xl overflow-hidden">

            {/* Header */}
            <div className="flex justify-between p-4 border-b">

              <h3 className="text-xl font-bold">
                Certificate Preview
              </h3>

              <button onClick={() => setShowModal(false)}>
                <FaTimes size={22} />
              </button>

            </div>

            {/* Body */}
            <div className="p-6 flex justify-center">
              <CertificateDesign certificate={selectedCertificate} />
            </div>

            {/* Footer */}
            <div className="flex justify-center gap-4 p-4 border-t">

              <button
                onClick={generatePDF}
                className="btn-green"
                disabled={isGeneratingPdf}
              >
                <FaDownload /> {isGeneratingPdf ? "Generating..." : "Download"}
              </button>

              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="btn-indigo"
              >
                <FaShareAlt /> Share
              </button>

            </div>

            {/* Share */}
            {showShareOptions && (

              <div className="p-4 bg-gray-50 border-t">

                <div className="flex justify-center gap-4">

                  <button onClick={() => shareOnSocial("facebook")} className="share-btn bg-blue-600">
                    <FaFacebook />
                  </button>

                  <button onClick={() => shareOnSocial("twitter")} className="share-btn bg-sky-500">
                    <FaTwitter />
                  </button>

                  <button onClick={() => shareOnSocial("linkedin")} className="share-btn bg-blue-700">
                    <FaLinkedin />
                  </button>

                  <button onClick={() => shareOnSocial("whatsapp")} className="share-btn bg-green-600">
                    <FaWhatsapp />
                  </button>

                  <button onClick={() => shareOnSocial("link")} className="share-btn bg-gray-600">
                    <FaLink />
                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Certificates;