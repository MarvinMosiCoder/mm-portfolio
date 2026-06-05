import React from 'react';

interface TableHeaderProps {
    headers: string[];
   
}

const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => (
    <thead>
        <tr>
            {/* {headers.map((header, index) => (
                <th className="px-4 py-4" key={index}>
                    {header}
                </th>
            ))} */}
            <th className="px-4 py-4">
               Year
            </th>
            <th className="px-4 py-4">
               Project
            </th>
            <th className="px-4 py-4 hidden lg:table-cell">
               Made At
            </th>
            <th className="px-4 py-4 hidden lg:table-cell">
               Built With
            </th>
            {/* <th className="px-4 py-4 hidden lg:table-cell">
               Link
            </th> */}
        </tr>

    </thead>
);

export default TableHeader;