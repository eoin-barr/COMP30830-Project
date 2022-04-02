import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { StationType } from "../map";
import { FillLoading } from "../loading";
import { getStations } from "../../lib/api";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function CustomInput({ panTo }: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<StationType | null>(null);
  const [stations, setStations] = useState<StationType[] | null>(null);

  useEffect(() => {
    const res = async () => {
      const result = await getStations();
      setStations(result.data);
      setSelected(result.data[0]);
      setLoading(false);
    };
    res();
  }, []);

  const handleSelect = (station: StationType) => {
    setSelected(station);
    const lat = parseFloat(station.lat);
    const lng = parseFloat(station.lng);
    panTo({ lat, lng });
  };

  return (
    <div className=''>
      {loading ? (
        <FillLoading />
      ) : (
        stations &&
        selected && (
          <Listbox value={selected} onChange={(e) => handleSelect(e)}>
            {({ open }: any) => (
              <>
                <div className='mt-1 relative'>
                  <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm min-w-48'>
                    <span className='block truncate'>{selected.address}</span>
                    <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                      <SelectorIcon
                        className='h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    leave='transition ease-in duration-100'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                      {stations &&
                        stations.map((station) => (
                          <Listbox.Option
                            key={station.address}
                            className={({ active }: any) =>
                              classNames(
                                active
                                  ? "text-white bg-indigo-600"
                                  : "text-gray-900",
                                "cursor-default select-none relative py-2 pl-8 pr-4"
                              )
                            }
                            value={station}
                          >
                            {({ selected, active }: any) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {station.address}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-indigo-600",
                                      "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                    )}
                                  >
                                    <CheckIcon
                                      className='h-5 w-5'
                                      aria-hidden='true'
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )
      )}
    </div>
  );
}
