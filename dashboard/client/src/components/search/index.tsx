import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";

export function Search() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({});

  return (
    <div className='absolute top-4 left-4 z-10 w-full max-w-48 min-w-48'>
      <Combobox
        onSelect={async (address) => {
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
          } catch (err) {
            console.log(err);
          }
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder={"Enter an address"}
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ description }) => (
              <ComboboxOption key={description} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
