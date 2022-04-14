import React from "react";

export function FillLoading() {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-primary-black'>
      <div
        style={{ borderTopColor: "transparent" }}
        className={
          "border-solid rounded-full animate-spin border-white w-8 h-8 border-4"
        }
      />
    </div>
  );
}
