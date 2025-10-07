"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  // Keep only necessary state (avoid derived state duplication)
  const [checked, setChecked] = useState<boolean[]>(() =>
    issues.map(() => false)
  );
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Derived state — compute selected count from checked[]
  const selectedCount = useMemo(
    () => checked.filter(Boolean).length,
    [checked]
  );

  // Compute total open issues once
  const totalOpenIssues = useMemo(
    () => issues.filter((i) => i.status === "open").length,
    [issues]
  );

  // Toggle a single checkbox
  const handleToggle = (index: number): void => {
    if (issues[index].status !== "open") return;

    const updated = checked.map((value, i) => (i === index ? !value : value));
    setChecked(updated);
  };

  // Handle Select/Deselect All
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target;

    const updated = issues.map((issue) =>
      issue.status === "open" ? checked : false
    );

    setChecked(updated);
    setIsAllSelected(checked);
  };

  // Keep the header checkbox indeterminate state updated
  useEffect(() => {
    const allCheckbox = document.getElementById(
      "select-all-checkbox"
    ) as HTMLInputElement | null;

    if (!allCheckbox) return;

    allCheckbox.indeterminate =
      selectedCount > 0 && selectedCount < totalOpenIssues;

    setIsAllSelected(selectedCount === totalOpenIssues);
  }, [selectedCount, totalOpenIssues]);

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              id="select-all-checkbox"
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
          </th>
          <th className="py-6 text-left text-black">
            {selectedCount > 0
              ? `Selected ${selectedCount}`
              : "None selected"}
          </th>
          <th colSpan={2}></th>
        </tr>
        <tr className="border-2 border-gray-200">
          <th />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map(({ id, name, message, status }, index) => {
          const isOpen = status === "open";
          const isChecked = checked[index];

          return (
            <tr
              key={id}
              onClick={() => handleToggle(index)}
              className={`border-b border-gray-200 ${
                isOpen
                  ? "cursor-pointer hover:bg-blue-50 text-black"
                  : "text-gray-500 cursor-not-allowed"
              } ${isChecked ? "bg-blue-50" : ""}`}
            >
              <td className="py-6 pl-6">
                <input
                  type="checkbox"
                  className={`w-5 h-5 ${
                    isOpen ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
                  checked={isChecked}
                  disabled={!isOpen}
                  onChange={() => handleToggle(index)}
                  onClick={(e) => e.stopPropagation()} // prevent double toggle
                />
              </td>
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-[15px] h-[15px] rounded-full ${
                      isOpen ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isOpen ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {isOpen ? "Open" : "Resolved"}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
