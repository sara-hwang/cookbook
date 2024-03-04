import { Recipe } from "../../../../utils/types";
import "./NutritionLabel.css";

interface NutritionLabelProps {
  recipe: Recipe;
}

const NutritionLabel = ({ recipe }: NutritionLabelProps) => {
  const nutritionalProfile = recipe.nutritionalValues;
  const servings = recipe.servings;

  return !nutritionalProfile ? (
    <></>
  ) : (
    <section className="nutrition-facts">
      <header className="nutrition-facts__header">
        <h1 className="nutrition-facts__title">Nutrition Facts</h1>
        {recipe.servingDescription && (
          <p>Serving Size {recipe.servingDescription}</p>
        )}
      </header>
      <table className="nutrition-facts__table">
        <thead>
          <tr>
            <th colSpan={3} className="small-info">
              Amount Per Serving
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={2}>
              <b>Calories </b>
              {Math.round(nutritionalProfile["_1008"] / servings)}
            </th>
            <td />
          </tr>
          <tr className="thick-row">
            <td colSpan={3} className="small-info">
              {/* <b>% Daily Value*</b> */}
            </td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Total Fat </b>
              {Math.round(nutritionalProfile["_1004"] / servings) + "g"}
            </th>
            <td>{/* <b>22%</b> */}</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>
              Saturated Fat
              {" " + Math.round(nutritionalProfile["_1258"] / servings) + "g"}
            </th>
            <td>{/* <b>22%</b> */}</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>
              Trans Fat
              {" " + Math.round(nutritionalProfile["_1257"] / servings) + "g"}
            </th>
            <td></td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Cholesterol </b>
              {Math.round((nutritionalProfile["_1253"] / servings) * 1000) +
                "mg"}
            </th>
            <td>{/* <b>18%</b> */}</td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Sodium </b>
              {Math.round((nutritionalProfile["_1093"] / servings) * 1000) +
                "mg"}
            </th>
            <td>{/* <b>2%</b> */}</td>
          </tr>
          <tr>
            <th colSpan={2}>
              <b>Total Carbohydrate </b>
              {Math.round(nutritionalProfile["_1005"] / servings) + "g"}
            </th>
            <td>{/* <b>6%</b> */}</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>
              Dietary Fiber
              {" " + Math.round(nutritionalProfile["_1079"] / servings) + "g"}
            </th>
            <td>{/* <b>4%</b> */}</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>
              Sugars
              {" " + Math.round(nutritionalProfile["_2000"] / servings) + "g"}
            </th>
            <td></td>
          </tr>
          <tr className="thin-end">
            <th colSpan={2}>
              <b>Protein </b>
              {Math.round(nutritionalProfile["_1003"] / servings) + "g"}
            </th>
            <td></td>
          </tr>
          <tr className="thin-end">
            <td colSpan={2}>
              Calcium
              {" " +
                Math.round((nutritionalProfile["_1087"] / servings) * 1000) +
                "mg"}
            </td>
            <td />
          </tr>
          <tr className="thick-end">
            <td colSpan={2}>
              Iron{" "}
              {Math.round((nutritionalProfile["_1089"] / servings) * 1000) +
                "mg"}
            </td>
            <td />
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default NutritionLabel;
