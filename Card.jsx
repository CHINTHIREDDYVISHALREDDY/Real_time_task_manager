// import React, { useState } from 'react';

// export const Card = ({ children, progress = 0 }) => {
//   const [showTooltip, setShowTooltip] = useState(false);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip shifted right */}
//       {showTooltip && (
//         <div className="absolute z-50 -top-20 left-10 w-72 bg-white border border-gray-300 shadow-xl rounded-lg p-3 text-sm text-gray-800 animate-fade-in">
//           {children}
//         </div>
//       )}

//       {/* Card Body */}
//       <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-4 w-full max-w-sm h-32 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.02]">
//         <div className="text-gray-800 text-sm font-medium mb-2 line-clamp-2">
//           {children}
//         </div>
//         <div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-right mt-1 text-gray-600">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// 

// 

// import React, { useRef, useState, useEffect } from 'react';

// export const Card = ({ children, progress = 0 }) => {
//   const { title, description } = children;
//   const textRef = useRef(null);
//   const [isTruncated, setIsTruncated] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   useEffect(() => {
//     if (textRef.current) {
//       setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
//     }
//   }, [title]);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => description && setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
//           <div className="bg-white text-sm text-gray-800 shadow-2xl border border-gray-200 p-4 rounded-xl w-72 transition-all duration-200 relative">
//             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
//             <p className="font-medium text-gray-700">{description}</p>
//           </div>
//         </div>
//       )}

//       {/* Card */}
//       <div className="bg-white shadow-md rounded-xl border border-gray-200 p-4 w-full max-w-sm h-32 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-xl">
//         <div
//           className="text-gray-900 text-sm font-semibold mb-2 line-clamp-2"
//           ref={textRef}
//         >
//           {title}
//         </div>
//         <div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-right mt-1 text-gray-500 font-medium">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };



// 

// import React, { useRef, useState, useEffect } from 'react';

// export const Card = ({ children, progress = 0 }) => {
//   const { title, description } = children;
//   const textRef = useRef(null);
//   const tooltipContentRef = useRef(null);

//   const [isTruncated, setIsTruncated] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [scrollableTooltip, setScrollableTooltip] = useState(false);

//   useEffect(() => {
//     if (textRef.current) {
//       setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
//     }
//   }, [title]);

//   useEffect(() => {
//     if (tooltipContentRef.current) {
//       const contentHeight = tooltipContentRef.current.scrollHeight;
//       const containerHeight = 192; // max-h-48 = 12rem
//       setScrollableTooltip(contentHeight > containerHeight);
//     }
//   }, [description, showTooltip]);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => description && setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
//           <div
//             className={`bg-gradient-to-b from-white via-gray-50 to-white text-sm text-gray-800 shadow-2xl border border-gray-200 p-4 rounded-xl w-72 max-h-48 transition-all duration-200 relative ${
//               scrollableTooltip ? 'overflow-y-auto custom-scroll' : ''
//             }`}
//             ref={tooltipContentRef}
//           >
//             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
//             <p className="font-medium text-gray-700 whitespace-pre-wrap">{description}</p>
//           </div>
//         </div>
//       )}

//       {/* Card */}
//       <div className="bg-gradient-to-br from-white via-blue-50 to-white group-hover:from-blue-100 group-hover:to-blue-200 shadow-md rounded-xl border border-gray-200 p-4 w-full max-w-sm h-32 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-xl">
//         <div
//           className="text-gray-900 text-sm font-semibold mb-2 line-clamp-2"
//           ref={textRef}
//         >
//           {title}
//         </div>
//         <div>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-right mt-1 text-gray-500 font-medium">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useRef, useState, useEffect } from 'react';

// // Row-to-card gradient mapping
// const gradientMap = {
//   Completed: {
//     card: 'from-green-200 via-green-300 to-green-400',
//     tooltip: 'from-green-100 via-green-50 to-white',
//   },
//   Pending: {
//     card: 'from-yellow-200 via-yellow-300 to-yellow-400',
//     tooltip: 'from-yellow-100 via-yellow-50 to-white',
//   },
//   Accepted: {
//     card: 'from-blue-200 via-blue-300 to-blue-400',
//     tooltip: 'from-blue-100 via-blue-50 to-white',
//   },
//   Declined: {
//     card: 'from-red-200 via-red-300 to-red-400',
//     tooltip: 'from-red-100 via-red-50 to-white',
//   },
// };

// export const Card = ({ children, progress = 0, status = 'Pending' }) => {
//   const { title, description } = children;
//   const textRef = useRef(null);
//   const descRef = useRef(null);
//   const [isTruncated, setIsTruncated] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [tooltipScrollable, setTooltipScrollable] = useState(false);

//   useEffect(() => {
//     if (textRef.current) {
//       setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
//     }
//   }, [title]);

//   useEffect(() => {
//     if (descRef.current) {
//       const isOverflowing = descRef.current.scrollHeight > descRef.current.clientHeight;
//       setTooltipScrollable(isOverflowing);
//     }
//   }, [showTooltip, description]);

//   const gradient = gradientMap[status] || gradientMap['Pending'];

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => description && setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="absolute -top-36 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
//           <div className={`bg-gradient-to-br ${gradient.tooltip} text-sm text-gray-800 shadow-2xl border border-gray-200 p-4 rounded-xl w-72 max-h-48 transition-all duration-200 relative`}>
//             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
//             <p
//               className={`font-medium text-gray-700 whitespace-pre-wrap ${
//                 tooltipScrollable ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent pr-1' : ''
//               }`}
//               ref={descRef}
//               style={{ maxHeight: '11rem' }}
//             >
//               {description}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Card */}
//       <div
//         className={`bg-gradient-to-br ${gradient.card} shadow-md rounded-xl border border-gray-300 p-4 w-full max-w-sm h-32 flex flex-col justify-between transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-xl`}
//       >
//         <div
//           className="text-white text-sm font-semibold mb-2 line-clamp-2"
//           ref={textRef}
//         >
//           {title}
//         </div>
//         <div>
//           <div className="w-full bg-white/30 rounded-full h-2.5">
//             <div
//               className="bg-white/90 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-right mt-1 text-white font-medium">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useRef, useState, useEffect } from 'react';

// export const Card = ({ children, progress = 0, status = 'Pending' }) => {
//   const { title, description } = children;
//   const textRef = useRef(null);
//   const [isTruncated, setIsTruncated] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const gradients = {
//     Completed: {
//       card: 'from-green-300 via-green-200 to-green-100',
//       tooltip: 'from-green-100 to-white',
//     },
//     Pending: {
//       card: 'from-yellow-300 via-yellow-200 to-yellow-100',
//       tooltip: 'from-yellow-100 to-white',
//     },
//     Accepted: {
//       card: 'from-blue-300 via-blue-200 to-blue-100',
//       tooltip: 'from-blue-100 to-white',
//     },
//     Declined: {
//       card: 'from-red-300 via-red-200 to-red-100',
//       tooltip: 'from-red-100 to-white',
//     },
//   };

//   const gradient = gradients[status] || gradients['Pending'];

//   useEffect(() => {
//     if (textRef.current) {
//       setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
//     }
//   }, [title]);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => description && setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip (hover reveal of description) */}
//       {showTooltip && (
//         <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
//           <div
//             className={`bg-gradient-to-br ${gradient.tooltip} text-sm text-gray-800 shadow-xl border border-gray-200 p-4 rounded-xl w-72 max-h-40 overflow-y-auto transition-all duration-200 relative`}
//           >
//             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
//             <p className="font-medium text-gray-700 whitespace-pre-wrap">
//               {description}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Card UI */}
//       <div
//         className={`bg-gradient-to-br ${gradient.card} shadow-md rounded-2xl border border-gray-200 p-5 w-full max-w-sm h-36 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl`}
//       >
//         <div
//           className="text-gray-800 text-base font-semibold mb-3 line-clamp-2 tracking-tight"
//           ref={textRef}
//         >
//           {title}
//         </div>

//         <div>
//           <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
//             <div
//               className="bg-gray-700 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-gray-600 text-right mt-2 font-medium">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };


// import React, { useRef, useState, useEffect } from 'react';

// export const Card = ({ children, progress = 0, status = 'Pending' }) => {
//   const { title, description } = children;
//   const textRef = useRef(null);
//   const [isTruncated, setIsTruncated] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const gradients = {
//     Completed: {
//       card: 'from-green-300 via-green-200 to-green-100',
//       tooltip: 'from-green-100 to-white',
//     },
//     Pending: {
//       card: 'from-yellow-300 via-yellow-200 to-yellow-100',
//       tooltip: 'from-yellow-100 to-white',
//     },
//     Accepted: {
//       card: 'from-blue-300 via-blue-200 to-blue-100',
//       tooltip: 'from-blue-100 to-white',
//     },
//     Declined: {
//       card: 'from-red-300 via-red-200 to-red-100',
//       tooltip: 'from-red-100 to-white',
//     },
//   };

//   const gradient = gradients[status] || gradients['Pending'];

//   useEffect(() => {
//     if (textRef.current) {
//       setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
//     }
//   }, [title]);

//   return (
//     <div
//       className="relative group"
//       onMouseEnter={() => description && setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
//           <div
//             className={`bg-gradient-to-br ${gradient.tooltip} text-sm text-gray-800 shadow-xl border border-gray-200 p-4 rounded-xl w-72 transition-all duration-200 relative`}
//             style={{
//               maxHeight: '10rem',
//               overflowY: description.length > 180 ? 'auto' : 'visible',
//             }}
//           >
//             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
//             <p className="font-medium text-gray-700 whitespace-pre-wrap">
//               {description}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Card */}
//       <div
//         className={`bg-gradient-to-br ${gradient.card} shadow-md rounded-2xl border border-gray-200 p-5 w-full max-w-sm h-36 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl`}
//       >
//         <div
//           className="text-gray-800 text-base font-semibold mb-3 line-clamp-2 tracking-tight"
//           ref={textRef}
//         >
//           {title}
//         </div>

//         <div>
//           <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
//             <div
//               className="bg-gray-700 h-2.5 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-gray-600 text-right mt-2 font-medium">{progress}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useRef, useState, useEffect } from 'react';

export const Card = ({ children, progress = 0, status = 'Pending' }) => {
  const { title, description } = children;
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const gradients = {
    Completed: {
      card: 'from-green-300 via-green-200 to-green-100',
      tooltip: 'from-green-100 to-white',
    },
    Pending: {
      card: 'from-yellow-300 via-yellow-200 to-yellow-100',
      tooltip: 'from-yellow-100 to-white',
    },
    Accepted: {
      card: 'from-blue-300 via-blue-200 to-blue-100',
      tooltip: 'from-blue-100 to-white',
    },
    Declined: {
      card: 'from-red-300 via-red-200 to-red-100',
      tooltip: 'from-red-100 to-white',
    },
  };

  const gradient = gradients[status] || gradients['Pending'];

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [title]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => description && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`bg-gradient-to-br ${gradient.tooltip} text-sm text-gray-800 shadow-xl border border-gray-200 p-4 rounded-xl w-72 transition-all duration-200 relative`}
            style={{
              maxHeight: '10rem',
              overflowY: description.length > 180 ? 'auto' : 'visible',
            }}
          >
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white shadow-sm"></div>
            <p className="font-medium text-gray-700 whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className={`bg-gradient-to-br ${gradient.card} shadow-md rounded-2xl border border-gray-200 p-5 flex flex-col justify-between transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl w-full min-w-60 max-w-xs`}
      >
        <div
          className="text-gray-800 text-base font-semibold mb-3 tracking-tight break-words"
          ref={textRef}
        >
          {title}
        </div>

        <div>
          <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gray-700 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 text-right mt-2 font-medium">{progress}%</p>
        </div>
      </div>
    </div>
  );
};



