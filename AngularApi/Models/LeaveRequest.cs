namespace AngularApi.Models;

public sealed class LeaveRequest
{
    public string Id { get; set; } = "";
    public string RequestCode { get; set; } = "";
    public string EmployeeName { get; set; } = "";
    public string Department { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string LeaveType { get; set; } = "";
}
