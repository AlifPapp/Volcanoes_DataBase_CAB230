import React from 'react';

const AlertWindow = ({ title, content, loader, full_window }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${full_window ? 'h-screen' : ''}`}>
      <div className="flex flex-col items-center w-full ">
        <div className="flex flex-row items-center justify-evenly align-middle">
          {title && (
            <span after={`${title}`} className={`highlighted-heading text-7xl text-center`}>
              {title}
            </span>
          )}
          {loader && (
            <div className="ml-8 animate-spin border-t-red-700 border-gray-300 rounded-full border-4 h-14 aspect-square"></div>
          )}
        </div>
        {content && (
          <div className={`mt-4 flex flex-col items-center rounded-md border-2 border-red-700`}>
            <span className="p-4 text-center text-lg">
              {content}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertWindow;
