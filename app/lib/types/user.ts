export interface UserDTO {
  etfNo: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  nic: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  address: string;
  designation: string;
  employeeType: "PERMANENT" | "CONTRACT";
  specialization: string;
  underwritingLimit: number;
  approvalLevel: number;
  branchCode: string;
  department: string;
  status: "ACTIVE" | "INACTIVE";
  joinedDate: string;
  role: "ADMIN" | "USER" | "UNDERWRITER";
}