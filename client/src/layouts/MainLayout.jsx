import { Outlet, useLocation, Link } from 'react-router-dom';
import React from 'react';
import Navbar from '../components/Navbar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { RenderSleepAlertDialog } from '../components/SleepAlert.jsx';

const MainLayout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(x => x);

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>
      <Navbar />

      <RenderSleepAlertDialog/>


      {/* Breadcrumbs */}
      {pathnames.length > 0 && (
        <Breadcrumb className="my-4 text-sm text-gray-700">
          <BreadcrumbList className="flex items-center gap-1 flex-wrap">
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="hover:underline font-medium text-black">
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathnames.map((segment, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator className="mx-1 text-gray-500">/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-gray-800 font-semibold">
                        {decodeURIComponent(segment)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild className="hover:underline text-gray-700">
                        <Link to={to}>{decodeURIComponent(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}


      <Outlet />
    </div>
  );
};

export default MainLayout;