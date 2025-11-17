import React, { useState } from "react";
import { VStack, HStack, Text, Button, Image } from "@ui";
import { Input } from "../Inputs/input";
import Select from "../Inputs/Select";
import { filterStyles } from "./Styles";
import filterIcon from "../../../assets/images/FilterIcon.png";

const Filters = () => {
   // const theme = useTheme();
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All Roles");
    const [status, setStatus] = useState("All Status");

    const roleOptions = [
        { label: "All Roles", value: "All Roles" },
        { label: "Admin", value: "Admin" },
        { label: "Supervisor", value: "Supervisor" },
        { label: "Linkage Champion", value: "Linkage Champion" },
        { label: "Participant", value: "Participant" },
    ];

    const statusOptions = [
        { label: "All Status", value: "All Status" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
    ];

    const handleClearFilters = () => {
        setSearch("");
        setRole("All Roles");
        setStatus("All Status");
    };

    return (
        <VStack {...filterStyles.container}>
            {/* Title */}
            <HStack {...filterStyles.titleContainer}>
                <Image 
                    source={filterIcon}
                    style={{ width: 20, height: 20 }}
                />
                <Text {...filterStyles.titleText} ml='$2'>
                    Filters
                </Text>
            </HStack>

            {/* Filters Row */}
            <HStack {...filterStyles.filterFieldsContainer}>
                {/* Search */}
                <VStack {...filterStyles.searchContainer}>
                    <Text {...filterStyles.label}>Search</Text>
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChangeText={setSearch}
                        {...filterStyles.input}
                    />
                </VStack>

                {/* Role Dropdown */}
                <VStack {...filterStyles.roleContainer}>
                    <Text {...filterStyles.label}>Role</Text>
                    <Select
                        value={role}
                        onChange={setRole}
                        options={roleOptions}
                        {...filterStyles.input}
                    />
                </VStack>

                {/* Status Dropdown */}
                <VStack {...filterStyles.statusContainer}>
                    <Text {...filterStyles.label}>Status</Text>
                    <Select
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        {...filterStyles.input}
                    />
                </VStack>

                {/* Clear Filters Button */}
                <VStack {...filterStyles.clearButtonContainer}>
                    <Button 
                        onPress={handleClearFilters}
                        {...filterStyles.button}
                    >
                        <Text {...filterStyles.buttonText}>Clear Filters</Text>
                    </Button>
                </VStack>
            </HStack>
        </VStack>
    );
};

export default Filters;