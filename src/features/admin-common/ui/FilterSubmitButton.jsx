import React from "react";

import { Button } from "@/shared";

const FilterSubmitButton = ({ children = "Apply" }) => {
  return <Button type="submit" variant="secondary">{children}</Button>;
};

export default FilterSubmitButton;
