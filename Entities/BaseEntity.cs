using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class BaseEntity
    {
        //Yeni oluşturulan tablolarda bulunması gereken sütunları belirtir
        public int Id { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool isDeleted { get; set; }
    }
}
