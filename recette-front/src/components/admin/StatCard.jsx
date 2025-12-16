import Card from '../common/Card';

const StatCard = ({ title, value, Icon, gradient }) => {
    const IconComponent = Icon;
  return (

  <Card className="hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {value}
        </p>
      </div>
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
        <IconComponent className="w-7 h-7 text-white" />
      </div>
    </div>
  </Card>
);
}
export default StatCard;