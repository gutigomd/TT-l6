using System.ComponentModel.DataAnnotations;

namespace AngularApi.Models;

public sealed class LeaveRequestInput
{
    [Required(ErrorMessage = "Вкажіть код заявки.")]
    [StringLength(30, MinimumLength = 2, ErrorMessage = "Код заявки: від 2 до 30 символів.")]
    public string RequestCode { get; set; } = "";

    [Required(ErrorMessage = "Вкажіть ім'я працівника.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Працівник: від 2 до 100 символів.")]
    public string EmployeeName { get; set; } = "";

    [Required(ErrorMessage = "Вкажіть підрозділ.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Підрозділ: від 2 до 100 символів.")]
    public string Department { get; set; } = "";

    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    [Required(ErrorMessage = "Оберіть тип відпустки.")]
    public string LeaveType { get; set; } = "";
}
