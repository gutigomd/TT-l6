using Microsoft.AspNetCore.Mvc;
using AngularApi.Models;

namespace AngularApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class LeaveRequestsController : ControllerBase
{
    private static readonly object Gate = new();
    private static readonly HashSet<string> AllowedTypes = new(StringComparer.Ordinal)
    {
        "щорічна",
        "навчальна",
        "інша"
    };

    private static readonly List<LeaveRequest> Data = new()
    {
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-101", EmployeeName = "Олена Коваленко", Department = "Розробка", StartDate = new DateOnly(2026, 12, 1), EndDate = new DateOnly(2026, 12, 14), LeaveType = "щорічна" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-102", EmployeeName = "Ігор Мельник", Department = "Тестування", StartDate = new DateOnly(2026, 12, 3), EndDate = new DateOnly(2026, 12, 12), LeaveType = "навчальна" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-103", EmployeeName = "Марія Шевченко", Department = "Розробка", StartDate = new DateOnly(2026, 12, 5), EndDate = new DateOnly(2026, 12, 7), LeaveType = "інша" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-104", EmployeeName = "Дмитро Бондар", Department = "HR", StartDate = new DateOnly(2026, 12, 8), EndDate = new DateOnly(2026, 12, 18), LeaveType = "щорічна" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-105", EmployeeName = "Анна Ткаченко", Department = "Тестування", StartDate = new DateOnly(2026, 12, 10), EndDate = new DateOnly(2026, 12, 19), LeaveType = "навчальна" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-106", EmployeeName = "Олександр Кравець", Department = "Розробка", StartDate = new DateOnly(2026, 12, 14), EndDate = new DateOnly(2026, 12, 20), LeaveType = "щорічна" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-107", EmployeeName = "Катерина Савченко", Department = "HR", StartDate = new DateOnly(2026, 12, 16), EndDate = new DateOnly(2026, 12, 17), LeaveType = "інша" },
        new() { Id = Guid.NewGuid().ToString(), RequestCode = "LR-108", EmployeeName = "Максим Лисенко", Department = "Розробка", StartDate = new DateOnly(2026, 12, 21), EndDate = new DateOnly(2026, 12, 25), LeaveType = "щорічна" }
    };

    [HttpGet]
    public ActionResult<LeaveRequest[]> Get()
    {
        lock (Gate)
        {
            return Ok(Data.ToArray());
        }
    }

    [HttpPost]
    public ActionResult<LeaveRequest> Post([FromBody] LeaveRequestInput input)
    {
        string code = input.RequestCode.Trim();
        string employee = input.EmployeeName.Trim();
        string department = input.Department.Trim();
        string leaveType = input.LeaveType.Trim();

        if (code.Length < 2 || code.Length > 30)
            return BadRequest(new { detail = "Код заявки після обрізання пробілів має містити 2–30 символів." });

        if (employee.Length < 2 || employee.Length > 100)
            return BadRequest(new { detail = "Ім'я працівника після обрізання пробілів має містити 2–100 символів." });

        if (department.Length < 2 || department.Length > 100)
            return BadRequest(new { detail = "Назва підрозділу після обрізання пробілів має містити 2–100 символів." });

        if (!AllowedTypes.Contains(leaveType))
            return BadRequest(new { detail = "Неприпустимий тип відпустки. Дозволено: щорічна, навчальна, інша." });

        if (input.EndDate < input.StartDate)
            return BadRequest(new { detail = "Кінцева дата не може бути раніше початкової." });

        int calendarDays = input.EndDate.DayNumber - input.StartDate.DayNumber + 1;
        if (leaveType == "навчальна" && (calendarDays < 1 || calendarDays > 60))
            return BadRequest(new { detail = "Навчальна відпустка повинна тривати від 1 до 60 календарних днів включно." });

        lock (Gate)
        {
            if (Data.Any(item => string.Equals(item.RequestCode, code, StringComparison.OrdinalIgnoreCase)))
                return Conflict(new { detail = "Заявка з таким кодом уже існує." });

            var created = new LeaveRequest
            {
                Id = Guid.NewGuid().ToString(),
                RequestCode = code,
                EmployeeName = employee,
                Department = department,
                StartDate = input.StartDate,
                EndDate = input.EndDate,
                LeaveType = leaveType
            };

            Data.Add(created);
            return Ok(created);
        }
    }

    [HttpDelete("{id}")]
    public ActionResult<LeaveRequest> Delete(string id)
    {
        lock (Gate)
        {
            var existing = Data.FirstOrDefault(item => item.Id == id);
            if (existing is null)
                return NotFound(new { detail = "Запис не знайдено." });

            Data.Remove(existing);
            return Ok(existing);
        }
    }
}
