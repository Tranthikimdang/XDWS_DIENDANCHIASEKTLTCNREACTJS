import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiBadge from "components/VuiBadge";
import { Link } from "react-router-dom";

// Images
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import avatar5 from "assets/images/avatar5.png";
import avatar6 from "assets/images/avatar6.png";

function Author({ image, name, email }) {
  return (
    <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <VuiBox mr={2}>
        <VuiAvatar src={image} alt={name} size="sm" variant="rounded" />
      </VuiBox>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {name}
        </VuiTypography>
        <VuiTypography variant="caption" color="text">
          {email}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

function Function({ job, org }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {job}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {org}
      </VuiTypography>
    </VuiBox>
  );
}


const handleDelete = (id) => {
  console.log("Delete", id);
  // Thực hiện hành động xóa ở đây
};

export default {
  columns: [
    { name: "ordinal", align: "left" },
    { name: "author", align: "left" },
    { name: "function", align: "left" },
    { name: "status", align: "center" },
    { name: "discription", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          1
        </VuiTypography>
      ),
      author: <Author image={avatar1} name="Esthera Jackson" email="esthera@simmmple.com" />,
      function: <Function job="Manager" org="Organization" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Online"
          color="success"
          size="xs"
          container
          sx={({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
            background: success.main,
            border: `${borderWidth[1]} solid ${success.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>          
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          2
        </VuiTypography>
      ),
      author: <Author image={avatar2} name="Alexa Liras" email="alexa@simmmple.com" />,
      function: <Function job="Programator" org="Developer" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Offline"
          size="xs"
          container
          sx={({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
            background: "unset",
            border: `${borderWidth[1]} solid ${white.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>          
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          3
        </VuiTypography>
      ),
      author: <Author image={avatar3} name="Laurent Michael" email="laurent@simmmple.com" />,
      function: <Function job="Executive" org="Projects" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Online"
          color="success"
          size="xs"
          container
          sx={({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
            background: success.main,
            border: `${borderWidth[1]} solid ${success.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>         
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          4
        </VuiTypography>
      ),
      author: <Author image={avatar4} name="Freduardo Hill" email="freduardo@simmmple.com" />,
      function: <Function job="Programator" org="Developer" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Online"
          color="success"
          size="xs"
          container
          sx={({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
            background: success.main,
            border: `${borderWidth[1]} solid ${success.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>          
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          5
        </VuiTypography>
      ),
      author: <Author image={avatar5} name="Daniel Thomas" email="daniel@simmmple.com" />,
      function: <Function job="Manager" org="Executive" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Offline"
          size="xs"
          container
          sx={({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
            background: "unset",
            border: `${borderWidth[1]} solid ${white.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>          
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
    {
      ordinal: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          6
        </VuiTypography>
      ),
      author: <Author image={avatar6} name="Mark Wilson" email="mark@simmmple.com" />,
      function: <Function job="Programtor" org="Developer" />,
      status: (
        <VuiBadge
          variant="standard"
          badgeContent="Offline"
          size="xs"
          container
          sx={({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
            background: "unset",
            border: `${borderWidth[1]} solid ${white.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
          })}
        />
      ),
      discription: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          Oh mai chuối!
        </VuiTypography>
      ),
      action: (
        <div>          
          <Link to="/formDeleteCmt">
            <button className='text-light btn btn-outline-danger' type="submit" onClick={() => handleDelete(1)} >Delete</button>
          </Link>
        </div>
      ),
    },
  ],
};
