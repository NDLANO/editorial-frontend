/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldInputProps } from "formik";
import { act, fireEvent, render } from "@testing-library/react";
import IntlWrapper from "../../../util/__tests__/IntlWrapper";
import AvailabilityField from "../components/AvailabilityField";

const mockField: FieldInputProps<string> = {
  name: "asd",
  value: "everyone",
  onBlur: () => {},
  onChange: () => {},
};

describe("<AvailabilityField />", () => {
  it("renders correctly and sets availability to Alle when everyone is passed as prop", async () => {
    const { getByLabelText, getByText } = render(
      <IntlWrapper>
        <AvailabilityField field={mockField} />
      </IntlWrapper>,
    );

    expect(getByText("Hvem er artikkelen ment for:")).toBeInTheDocument();

    const allRadio = getByLabelText("Alle");
    const teachersRadio = getByLabelText("Lærere");

    expect(allRadio).toBeChecked();
    act(() => {
      fireEvent.click(teachersRadio);
    });
    expect(teachersRadio).not.toBeChecked();
    expect(allRadio).toBeChecked();
  });
});
