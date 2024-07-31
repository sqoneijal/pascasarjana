import React from "react";

const Toolbar = ({ toolbarButton }) => {
   return (
      <div className="toolbar py-5 pb-lg-15" id="kt_toolbar">
         <div id="kt_toolbar_container" className="container-xxl d-flex flex-stack flex-wrap">
            <div className="page-title d-flex flex-column me-3" />
            {toolbarButton && <div className="d-flex align-items-center py-3 py-md-1">{toolbarButton}</div>}
         </div>
      </div>
   );
};
export default Toolbar;
