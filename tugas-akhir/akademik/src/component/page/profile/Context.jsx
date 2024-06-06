import React, { useState } from "react";
import { Bars } from "react-loader-spinner";
import Switch, { Case, Default } from "react-switch-case";

const Navbar = React.lazy(() => import("./Navbar"));
const Overview = React.lazy(() => import("./Overview"));
const Logs = React.lazy(() => import("./Logs"));

const Context = () => {
   // string
   const [menuActive, setMenuActive] = useState(2);

   const props = { menuActive, setMenuActive };

   return (
      <React.Suspense
         fallback={
            <Bars
               visible={true}
               color="#4fa94d"
               radius="9"
               wrapperStyle={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
               }}
               wrapperClass="page-loader flex-column bg-dark bg-opacity-25"
            />
         }>
         <Navbar {...props} />
         <Switch condition={menuActive}>
            <Case value={2}>
               <Logs />
            </Case>
            <Default>
               <Overview />
            </Default>
         </Switch>
      </React.Suspense>
   );
};
export default Context;
