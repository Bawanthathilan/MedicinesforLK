import { useEffect, useState } from "react";
import { AidPackage, AidPackages, NeedAssignments } from "../aidPackage";
import { AidPackageDetailsTable } from "./aidPackageDetailsTable";
import { AidPackageTable } from "./aidPackagesTable";
import "./manageAidPackages.css";
import { MedicalNeed } from "../../../types/MedicalNeeds";

export function ManageAidPackages({
  medicalNeeds,
  needAssignments,
  setNeedAssignments,
  aidPackages,
  setAidPackages,
  handleAidPkgPublish,
}: {
  medicalNeeds: MedicalNeed[];
  needAssignments: NeedAssignments;
  setNeedAssignments: (needAssignments: NeedAssignments) => void;
  aidPackages: AidPackages;
  setAidPackages: (aidPackages: AidPackages) => void;
  handleAidPkgPublish: (supplier: number) => Promise<void>;
}) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>();

  useEffect(() => {
    // get the list of suppliers assigned to a need
    const suppliers = new Set<number>();
    Object.keys(needAssignments).forEach((needID) => {
      needAssignments[needID].forEach((qty, supplierID) => {
        suppliers.add(supplierID);
      });
    });

    // return early if suppliers have not changed
    const sortedCurrentSupplierIds = Object.keys(aidPackages)
      .map(Number)
      .sort();
    const sortedSupplierIds = Array.from(suppliers.keys()).sort();
    if (
      JSON.stringify(sortedCurrentSupplierIds) !==
      JSON.stringify(sortedSupplierIds)
    ) {
      // create aid package for each supplier (aid package + #)
      const syncedAidPackages: AidPackages = {};
      Array.from(suppliers).forEach((supplierID, index) => {
        if (aidPackages[supplierID]) {
          syncedAidPackages[supplierID] = aidPackages[supplierID];
        } else {
          syncedAidPackages[supplierID] = {
            name: `AidPackage ${index + 1}`,
            details: "",
          };
        }
      });
      setAidPackages(syncedAidPackages);
    }
  }, [setAidPackages, aidPackages, needAssignments]);

  return (
    <>
      <AidPackageTable
        aidPackages={aidPackages}
        setSelectedPackage={setSelectedPackage}
        handleAidPkgPublish={handleAidPkgPublish}
        medicalNeeds={medicalNeeds}
        needAssignments={needAssignments}
      />
      {selectedPackage && (
        <AidPackageDetailsTable
          selectedPackage={aidPackages[selectedPackage]}
          updateAidPackage={(updatedPackage: AidPackage) => {
            setAidPackages({
              ...aidPackages,
              [selectedPackage]: updatedPackage,
            });
          }}
          supplierID={selectedPackage}
          needAssignments={needAssignments}
          medicalNeeds={medicalNeeds}
        />
      )}
    </>
  );
}
