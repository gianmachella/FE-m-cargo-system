import axios from "axios";

/* eslint-disable import/no-anonymous-default-export */
export const sizeBoxOptions = [
  { value: "17X11X11 - Small", label: "17X11X11 - Small", volume: 2.84 },
  { value: "12X12X16 - Small", label: "12X12X16 - Small", volume: 1.33 },
  { value: "21X15X16 - Medium", label: "21X15X15 - Medium", volume: 2.92 },
  { value: "18X18X16 - Medium", label: "18X18X16 - Medium", volume: 3 },
  { value: "27X15X16 - Large", label: "27X15X16 - Large", volume: 3.75 },
  { value: "18X18X24 - Large", label: "18X18X24 - Large", volume: 4.5 },
  {
    value: "24X20X21 - ExtraLarge",
    label: "24X20X21 - ExtraLarge",
    volume: 5.83,
  },
  {
    value: "22X22X21 - ExtraLarge",
    label: "22X22X21 - ExtraLarge",
    volume: 5.88,
  },
  { value: "personality", label: "Tamaño personalizado" },
];

export const getOptionsDestination = () => {
  axios
    .get("/api/options/destination")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
